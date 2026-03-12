
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { explainTopic, askDoubt } from "../services/api";
import MathRenderer from "../components/MathRenderer";

var SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "Science", "History", "English", "Geography", "Computer Science"];

var LANGUAGES = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Bengali', 'Bulgarian', 'Burmese', 'Chinese', 'Croatian', 'Czech', 'Danish', 'Dhivehi', 'Dutch', 'English', 'Estonian', 'Filipino', 'Finnish', 'French', 'Georgian', 'German', 'Greek', 'Hebrew', 'Hindi', 'Hungarian', 'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kazakh', 'Khmer', 'Korean', 'Kyrgyz', 'Lao', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malay', 'Maltese', 'Mongolian', 'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Serbian', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili', 'Swedish', 'Tajik', 'Thai', 'Tigrinya', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Zulu'];

// var LANGUAGE_SUBJECTS = ["english", "urdu",("hindi",("arabic",("french",("spanish",("german",("chinese",("japanese",("korean",("persian",
export default function ExplainTopic() {
  var navigate = useNavigate();
  var [subject, setSubject] = useState("Math");
  var [customSubject, setCustomSubject] = useState("");
  var [topic, setTopic] = useState("");
  var [language, setLanguage] = useState("English");
  var [explanation, setExplanation] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");

  // Doubt mode state
  var [doubts, setDoubts] = useState([]);
  var [doubtInput, setDoubtInput] = useState("");
  var [doubtLoading, setDoubtLoading] = useState(false);
  var [doubtError, setDoubtError] = useState("");

  var doubtEndRef = useRef(null);
  var doubtInputRef = useRef(null);
  var customInputRef = useRef(null);

  var isCustom = customSubject.trim().length > 0;
  var activeSubject = isCustom ? customSubject.trim() : subject;
  // var isLanguageSubject = LANGUAGE_SUBJECTS.indexOf(activeSubject.toLowerCase()) !== -1;

  useEffect(function() {
    if (doubtEndRef.current) {
      doubtEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [doubts]);

  function handleSelectPreset(s) {
    setSubject(s);
    setCustomSubject("");
  }

  function handleClickOther() {
    setSubject("");
    setCustomSubject("");
    setTimeout(function() {
      if (customInputRef.current) {
        customInputRef.current.focus();
      }
    }, 100);
  }

  function handleCustomChange(e) {
    var val = e.target.value;
    setCustomSubject(val);
    if (val.trim().length > 0) {
      setSubject("");
    }
  }

  async function handleExplain() {
    if (!topic.trim()) return;
    if (!activeSubject) return;
    if (loading) return;

    setLoading(true);
    setError("");
    setExplanation("");
    setDoubts([]);
    setDoubtInput("");
    setDoubtError("");

    try {
      var res = await explainTopic({
        subject: activeSubject.toLowerCase(),
        topic: topic.trim(),
        language: language
      });
      setExplanation(res.data.explanation);
    } catch(err) {
      setError(
        (err.response && err.response.data && err.response.data.error)
        || "Failed to generate explanation. Please try again."
      );
    }

    setLoading(false);
  }

  async function handleAskDoubt() {
    if (!doubtInput.trim()) return;
    if (doubtLoading) return;
    if (!explanation) return;

    var question = doubtInput.trim();
    setDoubtLoading(true);
    setDoubtError("");
    setDoubtInput("");

    var newDoubts = doubts.concat([{ type: "question", text: question }]);
    setDoubts(newDoubts);

    try {
      var res = await askDoubt({
        subject: activeSubject.toLowerCase(),
        topic: topic.trim(),
        explanation: explanation,
        doubt: question,
        language: language
      });

      setDoubts(function(prev) {
        return prev.concat([{ type: "answer", text: res.data.answer }]);
      });
    } catch(err) {
      setDoubtError(
        (err.response && err.response.data && err.response.data.error)
        || "Failed to answer doubt. Please try again."
      );
      setDoubts(function(prev) {
        return prev.slice(0, -1);
      });
      setDoubtInput(question);
    }

    setDoubtLoading(false);

    if (doubtInputRef.current) {
      doubtInputRef.current.focus();
    }
  }

  function handleDoubtKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !doubtLoading) {
      e.preventDefault();
      handleAskDoubt();
    }
  }

  var canExplain = topic.trim().length > 0 && activeSubject.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          <i className="fas fa-book-open text-indigo-500 mr-3"></i>
          Topic Explanation
        </h1>
        <p className="text-gray-500 mt-1">AI-powered explanations with follow-up doubt clearing</p>
      </div>

      {/* Input Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">

        {/* Subject Selection */}
        <label className="block text-sm text-gray-400 mb-2">Select Subject</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {SUBJECTS.map(function(s) {
            var isActive = !isCustom && subject === s;
            return (
              <button key={s}
                onClick={function() { handleSelectPreset(s); }}
                disabled={loading || isCustom}
                className={"px-4 py-2 rounded-lg text-sm font-medium transition " +
                  (isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : isCustom
                      ? "bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed opacity-40"
                      : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-indigo-500 hover:text-white disabled:opacity-50")}>
                {s}
              </button>
            );
          })}

          {/* Other Button */}
          <button
            onClick={handleClickOther}
            disabled={loading}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition " +
              (isCustom
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-gray-900 text-amber-400 border border-amber-500/30 hover:border-amber-500 hover:text-amber-300 disabled:opacity-50")}>
            <i className="fas fa-plus-circle mr-1"></i>Other
          </button>
        </div>

        {/* Custom Subject Input */}
        {(isCustom || (!subject && !isCustom)) && (
          <div className="mt-3 mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">
              <i className="fas fa-pen mr-1 text-amber-400"></i>Enter Subject
            </label>
            <div className="flex gap-3 items-center">
              <input
                ref={customInputRef}
                value={customSubject}
                onChange={handleCustomChange}
                disabled={loading}
                placeholder="e.g., Economics, Urdu, French, Civics, Philosophy..."
                className="flex-1 bg-gray-900 border border-amber-500/40 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition disabled:opacity-50 text-sm"
              />
              {isCustom && (
                <button
                  onClick={function() {
                    setCustomSubject("");
                    setSubject("Math");
                  }}
                  disabled={loading}
                  className="text-gray-500 hover:text-red-400 transition text-sm px-2 py-1 shrink-0"
                  title="Clear custom subject">
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
            {isCustom && (
              <p className="text-xs text-amber-400/70 mt-1.5">
                <i className="fas fa-info-circle mr-1"></i>
                Using custom subject: <strong className="text-amber-400">{customSubject.trim()}</strong>
                — AI will adapt language and content accordingly
              </p>
            )}
          </div>
        )}

        {/* Active Subject Indicator */}
        {activeSubject && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-gray-500">Active subject:</span>
            <span className={"px-2.5 py-1 rounded-full text-xs font-semibold " +
              (isCustom
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30")}>
              {activeSubject}
            </span>
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/*  EXPLANATION LANGUAGE DROPDOWN — NEW      */}
        {/* ══════════════════════════════════════════ */}
        <label className="block text-sm text-gray-400 mb-2">
          <i className="fas fa-language mr-1 text-indigo-400"></i>Explanation Language
        </label>
        <div className="flex items-center gap-3 mb-5">
          <select
            value={language}
            onChange={function(e) { setLanguage(e.target.value); }}
            disabled={loading}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 cursor-pointer appearance-none pr-10"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            {LANGUAGES.map(function(lang) {
              return <option key={lang} value={lang}>{lang}</option>;
            })}
          </select>

          
        </div>

        {/* Topic Input */}
        <label className="block text-sm text-gray-400 mb-2">Enter Topic</label>
        <div className="flex gap-3">
          <input
            value={topic}
            onChange={function(e) { setTopic(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter" && canExplain) handleExplain(); }}
            disabled={loading}
            placeholder="e.g., Quadratic Equations, Photosynthesis, World War II..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button onClick={handleExplain} disabled={loading || !canExplain}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 shrink-0">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</>
              : <><i className="fas fa-wand-magic-sparkles"></i> Explain</>
            }
          </button>
        </div>

        {explanation && (
          <button onClick={function() { navigate("/create-test"); }}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            <i className="fas fa-pen-to-square mr-2"></i>Start a Test on This Topic
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>{error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">AI teacher is preparing your explanation...</p>
          <p className="text-gray-600 text-sm mt-1">This may take 10-20 seconds</p>
        </div>
      )}

      {/* Explanation */}
      {explanation && !loading && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={"w-10 h-10 rounded-lg flex items-center justify-center " +
              (isCustom ? "bg-amber-500" : "bg-indigo-600")}>
              <i className="fas fa-chalkboard-teacher text-white"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{topic}</h2>
              <p className="text-sm text-gray-500 capitalize">{activeSubject}</p>
            </div>
          </div>
          <MathRenderer text={explanation} />
        </div>
      )}

      {/* DOUBT MODE */}
      {explanation && !loading && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">

          {/* Doubt header */}
          <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-question-circle text-amber-400 text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Still confused? Ask a doubt</h3>
                <p className="text-xs text-gray-500">Ask follow-up questions about {topic} ({activeSubject})</p>
              </div>
            </div>
          </div>

          {/* Doubt conversation */}
          {doubts.length > 0 && (
            <div className="px-6 py-4 max-h-96 overflow-y-auto space-y-4">
              {doubts.map(function(item, idx) {
                if (item.type === "question") {
                  return (
                    <div key={idx} className="flex justify-end">
                      <div className="max-w-[80%] bg-indigo-600/20 border border-indigo-500/30 rounded-xl rounded-br-sm px-4 py-3">
                        <p className="text-xs text-indigo-400 font-medium mb-1">
                          <i className="fas fa-user mr-1"></i>Your Doubt
                        </p>
                        <p className="text-sm text-white">{item.text}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="flex justify-start">
                      <div className="max-w-[85%] bg-gray-900 border border-gray-700 rounded-xl rounded-bl-sm px-4 py-3">
                        <p className="text-xs text-emerald-400 font-medium mb-2">
                          <i className="fas fa-chalkboard-teacher mr-1"></i>Teacher
                        </p>
                        <div className="text-sm">
                          <MathRenderer text={item.text} />
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

              {doubtLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl rounded-bl-sm px-4 py-3">
                    <p className="text-xs text-emerald-400 font-medium mb-2">
                      <i className="fas fa-chalkboard-teacher mr-1"></i>Teacher
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-emerald-500 rounded-full animate-spin"></div>
                      Thinking...
                    </div>
                  </div>
                </div>
              )}

              <div ref={doubtEndRef}></div>
            </div>
          )}

          {doubtError && (
            <div className="px-6 py-2">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                <i className="fas fa-exclamation-circle mr-1"></i>{doubtError}
              </div>
            </div>
          )}

          {/* Doubt input */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50">
            <div className="flex gap-3">
              <input
                ref={doubtInputRef}
                value={doubtInput}
                onChange={function(e) { setDoubtInput(e.target.value); }}
                onKeyDown={handleDoubtKeyDown}
                disabled={doubtLoading}
                placeholder="Type your doubt here... (Press Enter to send)"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500 transition disabled:opacity-50"
              />
              <button onClick={handleAskDoubt} disabled={doubtLoading || !doubtInput.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shrink-0">
                {doubtLoading
                  ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  : <i className="fas fa-paper-plane"></i>
                }
                Ask
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              Doubts are answered in context of "{topic}" ({activeSubject}) only
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!explanation && !loading && !error && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <i className="fas fa-graduation-cap text-5xl text-gray-700 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Ready to Learn</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Select a subject (or type your own), enter any topic, and get an AI-powered explanation with doubt clearing.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["Quadratic Equations", "Photosynthesis", "Newton's Laws", "World War II", "Parts of Speech"].map(function(example) {
              return (
                <button key={example}
                  onClick={function() { setTopic(example); }}
                  className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white hover:border-indigo-500 transition">
                  {example}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}