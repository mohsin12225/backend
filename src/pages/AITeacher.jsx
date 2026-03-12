
// }
import React, { useState, useEffect, useRef, useCallback } from 'react';
import MathRenderer from '../components/MathRenderer';

import "katex/dist/katex.min.css";

var LANGUAGES = ['English', 'Urdu', 'Hindi', 'Arabic'];

var STYLES = [
  { value: 'normal', label: 'Normal Teacher' },
  { value: 'calm', label: 'Calm Teaching' },
  { value: 'strict', label: 'Strict Teaching' },
  { value: 'professional', label: 'Pro Tutor', pro: true }
];

var SUGGESTIONS = [
  'Explain photosynthesis step by step',
  'Help me understand quadratic equations',
  "What are Newton's three laws of motion?",
  'Explain the water cycle for class 5',
  'What is democracy? Explain simply',
  'Help me with fractions and decimals'
];

// ═══════════════════════════════════════════
//  SSE STREAM READER
// ═══════════════════════════════════════════

async function readStream(response, onToken, onDone, onError, onUsage) {
  var reader = response.body.getReader();
  var decoder = new TextDecoder('utf-8');
  var buffer = '';
  var currentEvent = '';

  try {
    while (true) {
      var result = await reader.read();
      if (result.done) { onDone(); return; }

      buffer += decoder.decode(result.value, { stream: true });
      var lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line) { currentEvent = ''; continue; }
        if (line[0] === ':') continue;

        // ── Track named SSE events ──
        if (line.startsWith('event:')) {
          currentEvent = line.slice(6).trim();
          continue;
        }

        if (line.startsWith('data:')) {
          var payload = line.slice(5);
          if (payload[0] === ' ') payload = payload.slice(1);

          if (payload === '[DONE]') { onDone(); return; }
          if (payload.startsWith('[ERROR]')) { onError(new Error(payload.slice(8))); return; }
          if (!payload) continue;

          // ── Handle usage event separately ──
          if (currentEvent === 'usage' && onUsage) {
            try { onUsage(JSON.parse(payload)); } catch (e) {}
            currentEvent = '';
            continue;
          }

          // JSON token (normal AI response)
          try {
            var obj = JSON.parse(payload);
            if (obj && typeof obj.token === 'string') {
              onToken(obj.token);
              currentEvent = '';
              continue;
            }
            // Skip any other JSON objects that aren't tokens
            if (obj && typeof obj === 'object' && !obj.token) {
              currentEvent = '';
              continue;
            }
          } catch (e) {
            // fallback: treat as plain text
          }

          onToken(payload);
          currentEvent = '';
        }
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') onError(err);
  }
}

// ═══════════════════════════════════════════
//  AI TEACHER COMPONENT
// ═══════════════════════════════════════════

export default function AITeacher() {
  var [messages, setMessages] = useState([]);
  var [input, setInput] = useState('');
  var [isStreaming, setIsStreaming] = useState(false);
  var [language, setLanguage] = useState('English');
  var [style, setStyle] = useState('normal');
  var [messageUsage, setMessageUsage] = useState(null);
  var [showLimitModal, setShowLimitModal] = useState(false);
  var [limitModalMessage, setLimitModalMessage] = useState('');

  var streamRef = useRef('');
  var chatEndRef = useRef(null);
  var inputRef = useRef(null);
  var abortRef = useRef(null);
  var timerRef = useRef(null);
  var tokenCountRef = useRef(0);

  function scrollDown() {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }


    useEffect(scrollDown, [messages]);
  useEffect(function () { if (inputRef.current) inputRef.current.focus(); }, []);
    // ── Fetch initial usage on mount ──
  useEffect(function () {
    var authToken = localStorage.getItem('eduai_token');
    if (!authToken) return;
    fetch('http://localhost:5000/api/ai-teacher/usage', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.dailyLimit != null) setMessageUsage(data);
      })
      .catch(function () {});
  }, []);

  // ─────────────────────────────────────
  //  DELAYED MARKDOWN UPDATE (80ms)
  //  Prevents broken headings during stream
  // ─────────────────────────────────────
  function scheduleUpdate() {
    if (timerRef.current) return;
    timerRef.current = setTimeout(function () {
      timerRef.current = null;
      var text = streamRef.current;
      setMessages(function (prev) {
        var arr = prev.slice();
        var last = arr.length - 1;
        if (last >= 0 && arr[last]._streaming) {
          arr[last] = { role: 'assistant', content: text, time: arr[last].time, _streaming: true };
        }
        return arr;
      });
      scrollDown();
    }, 80);
  }

  function finalizeMsg(content, isError) {
    setMessages(function (prev) {
      var arr = prev.slice();
      for (var k = arr.length - 1; k >= 0; k--) {
        if (arr[k]._streaming) {
          arr[k] = { role: 'assistant', content: content || 'No response.', time: new Date(), isError: !!isError };
          break;
        }
      }
      return arr;
    });
  }

  function cleanup() {
    setIsStreaming(false);
    streamRef.current = '';
    tokenCountRef.current = 0;
    abortRef.current = null;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (inputRef.current) inputRef.current.focus();
  }

  // ─────────────────────────────────────
  //  SEND + STREAM
  // ─────────────────────────────────────
  var handleSend = useCallback(async function (overrideMsg) {
    var text = overrideMsg || input.trim();
    if (!text || isStreaming) return;

    var history = messages.filter(function (m) { return !m.isError; }).map(function (m) {
      return { role: m.role, content: m.content };
    });

    setInput('');
    setIsStreaming(true);
    streamRef.current = '';
    tokenCountRef.current = 0;

    setMessages(function (prev) {
      return prev.concat([
        { role: 'user', content: text, time: new Date() },
        { role: 'assistant', content: '', time: new Date(), _streaming: true }
      ]);
    });

    try {
      var authToken = localStorage.getItem('eduai_token');
      var controller = new AbortController();
      abortRef.current = controller;

      var response = await fetch('http://localhost:5000/api/ai-teacher/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          message: text,
          language: language,
          style: style,
          history: history.slice(-20)
        }),
        signal: controller.signal
      });

            if (!response.ok) {
        var errText = '';
        try { errText = await response.text(); } catch (e) {}

        // ── Handle daily limit reached (429) ──
        if (response.status === 429) {
          var limitMsg = 'You have reached today\'s free AI limit. Please try again tomorrow.';
          try {
            var errData = JSON.parse(errText);
            if (errData.message) limitMsg = errData.message;
            if (errData.messagesUsed != null) {
              setMessageUsage({ 
                messagesUsed: errData.messagesUsed,
                dailyLimit: errData.dailyLimit,
                hasCustomKey: errData.hasCustomKey,
                tokensUsed: errData.tokensUsed,
                customTokenLimit: errData.customTokenLimit
              });
            }
            if (!errData.hasCustomKey) {
              setLimitModalMessage(limitMsg);
              setShowLimitModal(true);
            }
          } catch (e) {}
          throw new Error(limitMsg);
        }

        throw new Error('Server error ' + response.status + ': ' + errText);
      }

      if (!response.body) throw new Error('Streaming not supported');

      await readStream(
        response,
        function (token) {
          tokenCountRef.current++;
          streamRef.current += token;
          scheduleUpdate();
        },
        function () {
          // Force final immediate render
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
          finalizeMsg(streamRef.current, false);
          cleanup();
        },
        function (err) {
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
          var partial = streamRef.current;
          if (partial) {
            finalizeMsg(partial + '\n\n*(Error: ' + err.message + ')*', false);
          } else {
            finalizeMsg(err.message, true);
          }
          cleanup();
        },
        function (usageData) {
          setMessageUsage(usageData);
        }
      );


    } catch (err) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      var partial = streamRef.current;
      if (err.name === 'AbortError') {
        finalizeMsg((partial || '') + (partial ? '\n\n*(Stopped)*' : '*(Stopped)*'), false);
      } else {
        finalizeMsg(err.message, true);
      }
      cleanup();
    }
  }, [input, messages, language, style, isStreaming]);

  // ─── Test stream ───
  async function handleTestStream() {
    setIsStreaming(true);
    streamRef.current = '';
    tokenCountRef.current = 0;

    setMessages(function (prev) {
      return prev.concat([
        { role: 'user', content: '(Test stream)', time: new Date() },
        { role: 'assistant', content: '', time: new Date(), _streaming: true }
      ]);
    });

    try {
      var resp = await fetch('http://localhost:5000/api/ai-teacher/test-stream');
      if (!resp.body) throw new Error('No body');

      await readStream(resp,
        function (token) { streamRef.current += token; scheduleUpdate(); },
        function () {
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
          finalizeMsg(streamRef.current, false); cleanup();
        },
        function (err) {
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
          finalizeMsg('Test failed: ' + err.message, true); cleanup();
        }
      );
    } catch (err) {
      finalizeMsg('Test error: ' + err.message, true);
      cleanup();
    }
  }

  // ─── Helpers ───
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) { e.preventDefault(); handleSend(); }
  }
  function handleNewChat() {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]); setInput(''); setIsStreaming(false);
    streamRef.current = ''; tokenCountRef.current = 0;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (inputRef.current) inputRef.current.focus();
  }
  function handleStop() { if (abortRef.current) abortRef.current.abort(); }
  function formatTime(d) {
    if (!d) return '';
    var dt = new Date(d); var h = dt.getHours();
    return (h % 12 || 12) + ':' + String(dt.getMinutes()).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
  }
  function getStyleLabel() {
    var s = STYLES.find(function (x) { return x.value === style; });
    return s ? s.label : 'Normal Teacher';
  }

  // ═══════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════
  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">

      <style>{`
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .stream-cursor::after {
          content: '▌'; color: #818cf8;
          animation: cursorBlink 0.7s step-end infinite;
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <i className="fas fa-chalkboard-teacher text-white"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Teacher</h1>
              <p className="text-xs text-gray-500">
                {getStyleLabel()} • {language}
                {isStreaming && <span className="text-indigo-400 ml-2">● Streaming</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* <select value={language} onChange={function (e) { setLanguage(e.target.value); }} disabled={isStreaming}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer">
              {LANGUAGES.map(function (l) { return <option key={l} value={l}>{l}</option>; })}
            </select>
            <select value={style} onChange={function (e) { setStyle(e.target.value); }} disabled={isStreaming}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer">
              {STYLES.map(function (s) { return <option key={s.value} value={s.value}>{s.label}{s.pro ? ' ⭐' : ''}</option>; })}
            </select> */}
            
            {messageUsage && (
              <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                <i className="fas fa-bolt text-amber-400 text-xs"></i>
                {messageUsage.hasCustomKey ? (
                  <span className="text-xs text-indigo-400 font-bold" title={`${messageUsage.tokensUsed?.toLocaleString()} / ${messageUsage.customTokenLimit?.toLocaleString()} tokens`}>
                    {Math.max(0, Math.floor((messageUsage.customTokenLimit - (messageUsage.tokensUsed || 0)) / 500))} MP
                  </span>
                ) : (
                  <span className="text-xs text-gray-300">
                    {(messageUsage.dailyLimit - messageUsage.messagesUsed) + ' / ' + messageUsage.dailyLimit}
                  </span>
                )}
                {!messageUsage.hasCustomKey && messageUsage.messagesUsed >= messageUsage.dailyLimit && (
                  <span className="text-[10px] text-red-400 ml-1">Limit reached</span>
                )}
                {messageUsage.hasCustomKey && (messageUsage.tokensUsed || 0) >= (messageUsage.customTokenLimit || 100000) && (
                  <span className="text-[10px] text-red-400 ml-1">Tokens exhausted</span>
                )}
              </div>
            )}

            <button onClick={handleNewChat} disabled={messages.length === 0 && !isStreaming}
              className="bg-gray-900 border border-gray-700 hover:border-red-500/50 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition disabled:opacity-30 flex items-center gap-1.5">
              <i className="fas fa-plus"></i><span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-gray-900/50 border border-gray-800 px-4 py-4 mb-4 space-y-4">

        {messages.length === 0 && !isStreaming && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-lg">
              <div className="relative mx-auto mb-6 w-16 h-16">
                <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                  <i className="fas fa-graduation-cap text-2xl text-white"></i>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hello! I'm your AI Teacher</h2>
              <p className="text-gray-400 text-sm mb-6">Ask me anything about your studies — math, science, history, languages and more!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map(function (s, i) {
                  return <button key={i} onClick={function () { handleSend(s); }}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white hover:border-indigo-500/50 transition text-left">
                    <i className="fas fa-lightbulb text-amber-400/60 mr-1.5"></i>{s}
                  </button>;
                })}
              </div>
            </div>
          </div>
        )}

        {messages.map(function (msg, idx) {
          if (msg.role === 'user') {
            return (
              <div key={'m' + idx} className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl rounded-br-sm px-4 py-3">
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1 text-right">{formatTime(msg.time)}</p>
                </div>
              </div>
            );
          }

          var isEmpty = !msg.content && msg._streaming;
          var showCursor = msg._streaming && msg.content;
return (
  <div key={'m' + idx} className="flex justify-start gap-3">
    {/* Keep the small icon (optional). Remove this div too if you want even more space */}
    <div
      className={
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 " +
        (msg.isError ? "bg-red-500/20" : "bg-indigo-600/20")
      }
    >
      <i
        className={
          "fas text-sm " +
          (msg.isError ? "fa-exclamation-triangle text-red-400" : "fa-chalkboard-teacher text-indigo-400")
        }
      ></i>
    </div>

    {/* Full-width content, no bubble */}
    <div className="flex-1 min-w-0">
      {isEmpty && (
        <div className="flex items-center gap-1.5 py-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <span className="text-xs text-gray-500 ml-2">Thinking...</span>
        </div>
      )}

      {msg.content && (
        <div
          className={
            (showCursor ? "stream-cursor " : "") +
            (msg.isError
              ? "text-red-200"
              : "text-gray-200")
          }
        >
          {/* optional subtle guide line like ChatGPT */}
          <div className={msg.isError ? "border-l-2 border-red-500/40 pl-4" : "border-l-2 border-indigo-500/20 pl-4"}>
            <MathRenderer text={msg.content} streaming={msg._streaming} />
          </div>
        </div>
      )}

      {!msg._streaming && (
        <p className="text-[10px] text-gray-600 mt-1">{formatTime(msg.time)}</p>
      )}
    </div>
  </div>
);



        })}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shrink-0">
        <div className="flex items-end gap-2">
          <button disabled={isStreaming} onClick={function () { alert('📎 Coming soon!'); }}
            className="text-gray-500 hover:text-indigo-400 transition p-2 shrink-0 disabled:opacity-30">
            <i className="fas fa-paperclip text-lg"></i>
          </button>
          <textarea ref={inputRef} value={input}
            onChange={function (e) { setInput(e.target.value); }}
            onKeyDown={handleKeyDown} disabled={isStreaming}
            placeholder="Ask your teacher anything... (Enter to send)" rows={1}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 resize-none max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
            onInput={function (e) {
              e.target.style.height = '42px';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          {isStreaming ? (
            <button onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition shrink-0 w-10 h-10 flex items-center justify-center">
              <i className="fas fa-stop text-sm"></i>
            </button>
          ) : (
            <button onClick={function () { handleSend(); }} disabled={!input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white p-2.5 rounded-xl transition shrink-0 w-10 h-10 flex items-center justify-center">
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-gray-600"><i className="fas fa-info-circle mr-1"></i>Enter to send • Shift+Enter new line</p>
          {isStreaming && <p className="text-[10px] text-indigo-400"><i className="fas fa-bolt mr-1"></i>Streaming...</p>}
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-3xl text-red-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Daily Free Limit Reached!</h3>
              <p className="text-gray-300 text-sm text-center mb-6 leading-relaxed">
                {limitModalMessage}
              </p>

              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <i className="fas fa-bolt text-indigo-400/20 text-4xl transform rotate-12"></i>
                </div>
                <h4 className="font-bold text-white text-sm mb-2 relative z-10 flex items-center gap-2">
                  <i className="fas fa-key text-indigo-400"></i> Bring Your Own Key (BYOK)
                </h4>
                <p className="text-xs text-gray-400 mb-3 relative z-10">
                  Don't want to wait until tomorrow? 
                  Provide your own Groq API key and unlock up to <strong className="text-white">200 Message Points</strong> (100,000 tokens) instantly!
                  Tokens are only deducted based on exact AI usage.
                </p>
                <div className="flex flex-col gap-2 relative z-10 text-[10px] text-gray-500">
                  <p>1. Go to console.groq.com to get a free API key.</p>
                  <p>2. Open Settings in the sidebar.</p>
                  <p>3. Paste your key and save.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-xl transition"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowLimitModal(false);
                    window.location.href = '/settings'; // Simple routing for MVP
                  }}
                  className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition flex justify-center items-center gap-2"
                >
                  <i className="fas fa-cog"></i> Go to Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
