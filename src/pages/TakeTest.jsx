
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTest, submitTest } from "../services/api";
import MathRenderer from "../components/MathRenderer";

var RTL_SUBJECTS = ["urdu", "arabic", "persian", "sindhi", "pashto", "hebrew", "kurdish", "farsi"];

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTest, setCurrentTest } = useApp();
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(function() {
    async function load() {
      try {
        var res = await getTest(id);
        if (res.data.status === "completed") {
          navigate("/results/" + id);
          return;
        }
        setTest(res.data);
      } catch(e) {
        navigate("/create-test");
      }
      setLoading(false);
    }
    load();
  }, [id, navigate]);

  useEffect(function() {
    if (loading || submitting) return;
    var interval = setInterval(function() {
      setTimer(function(t) { return t + 1; });
    }, 1000);
    return function() { clearInterval(interval); };
  }, [loading, submitting]);

  var setAnswer = useCallback(function(qId, answer) {
    setAnswers(function(prev) {
      var updated = Object.assign({}, prev);
      updated[qId] = answer;
      return updated;
    });
  }, []);

  var handleSubmit = async function() {
    if (!test) return;
    var answeredCount = Object.values(answers).filter(function(a) { return a && a.trim(); }).length;
    var confirmed = window.confirm(
      "Submit test? You answered " + answeredCount + " of " + test.questions.length + " questions."
    );
    if (!confirmed) return;

    setSubmitting(true);
    try {
      var answerArray = test.questions.map(function(q) {
        return {
          questionId: q._id,
          answer: answers[q._id] || "",
          timeSpent: Math.round(timer / test.questions.length)
        };
      });
      await submitTest(id, { answers: answerArray });
      navigate("/results/" + id);
    } catch(err) {
      alert("Failed to submit: " + (err.response ? err.response.data.error : err.message));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p>Loading test...</p>
      </div>
    );
  }

  if (!test) return null;

  var q = test.questions[currentIdx];
  if (!q) return null;

  var isRTL = RTL_SUBJECTS.indexOf((test.subject || "").toLowerCase()) !== -1;
  var contentDir = isRTL ? "rtl" : "ltr";
  var contentAlign = isRTL ? "text-right" : "text-left";

  var progress = ((currentIdx + 1) / test.questions.length) * 100;
  var mins = Math.floor(timer / 60);
  var secs = String(timer % 60).padStart(2, "0");
  var answeredCount = Object.values(answers).filter(function(a) { return a && a.trim(); }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white capitalize">{test.subject} Test</h1>
          <p className="text-gray-500 text-sm">{test.topic} - {test.difficulty}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono text-indigo-400">
            <i className="fas fa-clock mr-1"></i>{mins}:{secs}
          </div>
          <div className="text-xs text-gray-500">{answeredCount}/{test.questions.length} answered</div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Q{currentIdx + 1}/{test.questions.length}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {q.type === "mcq" ? "Multiple Choice" : "Written Answer"}
          </span>
          <span className="text-xs text-gray-600">
            {q.marks} {q.marks === 1 ? "mark" : "marks"}
          </span>
        </div>

        {/* Question text — RTL aware */}
        <div dir={contentDir} className={"text-lg text-white mb-6 leading-relaxed " + contentAlign}>
          <MathRenderer text={q.question || ""} />
        </div>

        {/* MCQ Options — RTL aware */}
        {q.type === "mcq" && q.options && (
          <div className="space-y-3">
            {q.options.map(function(option, idx) {
              var letter = option.charAt(0);
              var selected = answers[q._id] === letter;
              return (
                <button key={idx}
                  onClick={function() { setAnswer(q._id, letter); }}
                  dir={contentDir}
                  className={"w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 " +
                    contentAlign + " " +
                    (selected
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600") +
                    (isRTL ? " flex-row-reverse" : "")}>
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition " +
                    (selected ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-400")}>
                    {letter}
                  </div>
                  <div className={"flex-1 " + contentAlign}>
                    <MathRenderer text={option.substring(3).trim()} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Written answer — RTL aware */}
        {q.type === "written" && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Answer</label>
            <textarea
              value={answers[q._id] || ""}
              onChange={function(e) { setAnswer(q._id, e.target.value); }}
              rows={4}
              dir={contentDir}
              placeholder={isRTL ? "یہاں اپنا جواب لکھیں..." : "Type your answer here..."}
              className={"w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none " + contentAlign}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={function() { setCurrentIdx(function(i) { return Math.max(0, i - 1); }); }}
          disabled={currentIdx === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white px-5 py-2.5 rounded-lg transition flex items-center gap-2">
          <i className="fas fa-arrow-left"></i> Previous
        </button>

        <div className="flex gap-1.5 flex-wrap justify-center">
          {test.questions.map(function(tq, i) {
            var isAnswered = answers[tq._id] && answers[tq._id].trim();
            return (
              <button key={i}
                onClick={function() { setCurrentIdx(i); }}
                className={"w-8 h-8 rounded-lg text-xs font-medium transition " +
                  (i === currentIdx ? "bg-indigo-600 text-white"
                    : isAnswered ? "bg-emerald-600/30 text-emerald-400 border border-emerald-600/50"
                    : "bg-gray-700 text-gray-500 hover:bg-gray-600")}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {currentIdx < test.questions.length - 1 ? (
          <button
            onClick={function() { setCurrentIdx(function(i) { return i + 1; }); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition flex items-center gap-2">
            Next <i className="fas fa-arrow-right"></i>
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg transition flex items-center gap-2 font-semibold">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>
              : <><i className="fas fa-check-circle"></i> Submit Test</>}
          </button>
        )}
      </div>
    </div>
  );
}

