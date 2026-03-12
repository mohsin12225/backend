import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateTest } from '../services/api';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'Science', 'History', 'English', 'Geography', 'Computer Science'];
const LANGUAGES = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Bengali', 'Bulgarian', 'Burmese', 'Chinese', 'Croatian', 'Czech', 'Danish', 'Dhivehi', 'Dutch', 'English', 'Estonian', 'Filipino', 'Finnish', 'French', 'Georgian', 'German', 'Greek', 'Hebrew', 'Hindi', 'Hungarian', 'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kazakh', 'Khmer', 'Korean', 'Kyrgyz', 'Lao', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malay', 'Maltese', 'Mongolian', 'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Serbian', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili', 'Swedish', 'Tajik', 'Thai', 'Tigrinya', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Zulu'];

export default function CreateTest() {
  const navigate = useNavigate();
  const { setCurrentTest } = useApp();
  const [config, setConfig] = useState({
    subject: 'math',
    topic: '',
    difficulty: 'medium',
    numMCQs: 5,
    numWritten: 3,
    language: 'English'
  });
  const [customSubject, setCustomSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const customInputRef = useRef(null);

  var isCustom = customSubject.trim().length > 0;
  var activeSubject = isCustom ? customSubject.trim().toLowerCase() : config.subject;

  function handleSelectPreset(s) {
    setConfig(function(p) { return { ...p, subject: s.toLowerCase() }; });
    setCustomSubject('');
  }

  function handleClickOther() {
    setConfig(function(p) { return { ...p, subject: '' }; });
    setCustomSubject('');
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
      setConfig(function(p) { return { ...p, subject: '' }; });
    }
  }

  function handleClearCustom() {
    setCustomSubject('');
    setConfig(function(p) { return { ...p, subject: 'math' }; });
  }

  const handleGenerate = async () => {
    if (!activeSubject) { setError('Please select or enter a subject'); return; }
    if (!config.topic.trim()) { setError('Please enter a topic'); return; }
    if (config.numMCQs === 0 && config.numWritten === 0) { setError('Add at least one question'); return; }

    setLoading(true); setError('');
    try {
      var requestData = {
        subject: activeSubject,
        topic: config.topic,
        difficulty: config.difficulty,
        numMCQs: config.numMCQs,
        numWritten: config.numWritten,
        language: config.language
      };

      console.log('[CreateTest] Sending request:', requestData);

      const res = await generateTest(requestData);
      setCurrentTest(res.data);
      navigate(`/test/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate test. Check your Groq API key.');
    }
    setLoading(false);
  };

  const total = config.numMCQs + config.numWritten;
  const totalMarks = config.numMCQs * 1 + config.numWritten * 2;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          <i className="fas fa-pen-to-square text-indigo-500 mr-3"></i>Create Test
        </h1>
        <p className="text-gray-500 mt-1">AI generates questions based on your topic</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-dark-800 border border-gray-800 rounded-xl p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button key={s} onClick={function() { handleSelectPreset(s); }}
                  disabled={loading || isCustom}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${!isCustom && config.subject === s.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : isCustom
                        ? 'bg-dark-900 text-gray-600 border border-gray-800 cursor-not-allowed opacity-40'
                        : 'bg-dark-900 text-gray-400 border border-gray-700 hover:border-indigo-500 hover:text-white disabled:opacity-50'}`}>
                  {s}
                </button>
              ))}

              {/* Other Button */}
              <button
                onClick={handleClickOther}
                disabled={loading}
                className={"px-4 py-2 rounded-lg text-sm font-medium transition " +
                  (isCustom
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-dark-900 text-amber-400 border border-amber-500/30 hover:border-amber-500 hover:text-amber-300 disabled:opacity-50")}>
                <i className="fas fa-plus-circle mr-1"></i>Other
              </button>
            </div>

            {/* Custom Subject Input */}
            {(isCustom || (!config.subject && !isCustom)) && (
              <div className="mt-3">
                <label className="block text-sm text-gray-400 mb-1.5">
                  <i className="fas fa-pen mr-1 text-amber-400"></i>Enter Subject
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    ref={customInputRef}
                    value={customSubject}
                    onChange={handleCustomChange}
                    disabled={loading}
                    placeholder="e.g., Urdu, Islamiat, Economics, French..."
                    className="flex-1 bg-dark-900 border border-amber-500/40 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition disabled:opacity-50 text-sm"
                  />
                  {isCustom && (
                    <button
                      onClick={handleClearCustom}
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
                  </p>
                )}
              </div>
            )}

            {/* Active Subject Indicator */}
            {activeSubject && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Active subject:</span>
                <span className={"px-2.5 py-1 rounded-full text-xs font-semibold " +
                  (isCustom
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30")}>
                  {activeSubject}
                </span>
              </div>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Topic *</label>
            <input value={config.topic}
              onChange={e => { setConfig(p => ({ ...p, topic: e.target.value })); setError(''); }}
              placeholder="e.g., Newton's Laws, Quadratic Equations, Photosynthesis"
              className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
            <p className="text-xs text-gray-600 mt-1">AI will generate questions ONLY from this topic</p>
          </div>

          {/* Test Language */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              <i className="fas fa-language mr-1 text-indigo-400"></i>Test Language
            </label>
            <select
              value={config.language}
              onChange={function(e) { setConfig(function(p) { return { ...p, language: e.target.value }; }); }}
              disabled={loading}
              className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 cursor-pointer appearance-none pr-10 w-full sm:w-auto"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {LANGUAGES.map(function(lang) {
                return <option key={lang} value={lang}>{lang}</option>;
              })}
            </select>
            <p className="text-xs text-gray-600 mt-1">All questions, options, and explanations will be in this language</p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {[
                { val: 'easy', label: 'Easy', icon: '🟢' },
                { val: 'medium', label: 'Medium', icon: '🟡' },
                { val: 'hard', label: 'Hard', icon: '🔴' },
                { val: 'adaptive', label: 'Adaptive 🤖', icon: '' }
              ].map(d => (
                <button key={d.val} onClick={() => setConfig(p => ({ ...p, difficulty: d.val }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition
                    ${config.difficulty === d.val
                      ? 'bg-indigo-600 text-white'
                      : 'bg-dark-900 text-gray-400 border border-gray-700 hover:border-indigo-500'}`}>
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
            {config.difficulty === 'adaptive' && (
              <p className="text-xs text-indigo-400 mt-1">AI adjusts difficulty based on your past performance</p>
            )}
          </div>

          {/* Question counts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">MCQs (1 mark each)</label>
              <input type="number" min="0" max="15" value={config.numMCQs}
                onChange={e => setConfig(p => ({ ...p, numMCQs: parseInt(e.target.value) || 0 }))}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Written (2 marks each)</label>
              <input type="number" min="0" max="10" value={config.numWritten}
                onChange={e => setConfig(p => ({ ...p, numWritten: parseInt(e.target.value) || 0 }))}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-dark-900 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">
              <span className="capitalize font-medium text-white">{activeSubject || 'No subject'}</span>
              {config.topic && <> • <span className="text-indigo-400">{config.topic}</span></>}
              {' '} • {total} questions • {totalMarks} marks • {config.difficulty}
              {' '} • <span className="text-indigo-400">{config.language}</span>
            </p>
          </div>

          {/* Generate */}
          <button onClick={handleGenerate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg">
            {loading
              ? <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> AI is generating your test...</>
              : <><i className="fas fa-rocket"></i> Generate Test</>}
          </button>

          {loading && (
            <p className="text-center text-gray-600 text-sm">This may take 15-30 seconds as AI creates unique questions</p>
          )}
        </div>
      </div>
    </div>
  );
}