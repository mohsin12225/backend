// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getTest } from "../services/api";
// import MathRenderer from "../components/MathRenderer";

// export default function Results() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [test, setTest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showDetails, setShowDetails] = useState(false);

//   useEffect(function() {
//     getTest(id)
//       .then(function(r) { setTest(r.data); })
//       .catch(function() { navigate("/"); })
//       .finally(function() { setLoading(false); });
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-gray-500">
//         <div className="w-10 h-10 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
//         <p>Loading results...</p>
//       </div>
//     );
//   }

//   if (!test) return null;

//   var correct = test.questions.filter(function(q) { return q.isCorrect; }).length;
//   var incorrect = test.questions.filter(function(q) { return !q.isCorrect && !q.isSkipped; }).length;
//   var skipped = test.questions.filter(function(q) { return q.isSkipped; }).length;

//   var scoreColor = "red";
//   if (test.percentage >= 80) scoreColor = "emerald";
//   else if (test.percentage >= 50) scoreColor = "amber";

//   var scoreTextClass = "text-red-400";
//   if (test.percentage >= 80) scoreTextClass = "text-emerald-400";
//   else if (test.percentage >= 50) scoreTextClass = "text-amber-400";

//   var scoreBorderClass = "border-red-500";
//   if (test.percentage >= 80) scoreBorderClass = "border-emerald-500";
//   else if (test.percentage >= 50) scoreBorderClass = "border-amber-500";

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-white">
//           <i className="fas fa-chart-pie text-indigo-500 mr-3"></i>Test Results
//         </h1>
//         <p className="text-gray-500 mt-1 capitalize">{test.subject} - {test.topic} - {test.difficulty}</p>
//       </div>

//       <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center mb-6">
//         <div className={"w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center mx-auto mb-4 " + scoreBorderClass}>
//           <span className={"text-4xl font-bold " + scoreTextClass}>{test.percentage || 0}%</span>
//           <span className="text-xs text-gray-500">Score</span>
//         </div>

//         {test.feedback && (
//           <p className="text-gray-300 max-w-lg mx-auto mb-6">{test.feedback}</p>
//         )}

//         <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
//           <div className="text-center">
//             <div className="text-xl font-bold text-white">{test.obtainedMarks || 0}/{test.totalMarks || 0}</div>
//             <div className="text-xs text-gray-500">Marks</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xl font-bold text-emerald-400">{correct}</div>
//             <div className="text-xs text-gray-500">Correct</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xl font-bold text-red-400">{incorrect}</div>
//             <div className="text-xs text-gray-500">Wrong</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xl font-bold text-amber-400">{skipped}</div>
//             <div className="text-xs text-gray-500">Skipped</div>
//           </div>
//         </div>
//       </div>

//       {test.recommendations && test.recommendations.length > 0 && (
//         <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
//           <h3 className="text-lg font-semibold text-white mb-3">
//             <i className="fas fa-lightbulb text-amber-500 mr-2"></i>AI Recommendations
//           </h3>
//           <div className="space-y-2">
//             {test.recommendations.map(function(r, i) {
//               return (
//                 <div key={i} className="bg-indigo-500/10 border-l-4 border-indigo-500 px-4 py-2.5 rounded-r-lg text-sm text-gray-300">
//                   {r}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-white">
//             <i className="fas fa-list-check mr-2"></i>Question Details
//           </h3>
//           <button
//             onClick={function() { setShowDetails(function(s) { return !s; }); }}
//             className="text-sm text-indigo-400 hover:text-indigo-300 transition">
//             {showDetails ? "Hide Details" : "Show Details"}
//           </button>
//         </div>

//         {showDetails && (
//           <div className="space-y-4">
//             {test.questions.map(function(q, i) {
//               var statusClass = "border-red-500";
//               if (q.isCorrect) statusClass = "border-emerald-500";
//               else if (q.isSkipped) statusClass = "border-amber-500";

//               var badgeClass = "bg-red-500/20 text-red-400";
//               var badgeText = "Wrong " + (q.obtainedMarks || 0) + "/" + q.marks;
//               if (q.isCorrect) {
//                 badgeClass = "bg-emerald-500/20 text-emerald-400";
//                 badgeText = "Correct " + (q.obtainedMarks || 0) + "/" + q.marks;
//               } else if (q.isSkipped) {
//                 badgeClass = "bg-amber-500/20 text-amber-400";
//                 badgeText = "Skipped";
//               }

//               return (
//                 <div key={q._id || i} className={"p-5 rounded-xl border-l-4 bg-gray-900 " + statusClass}>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-sm font-medium text-gray-400">
//                       Q{i + 1} - {q.type === "mcq" ? "MCQ" : "Written"} - {q.marks} marks
//                     </span>
//                     <span className={"px-2.5 py-1 rounded-full text-xs font-semibold " + badgeClass}>
//                       {badgeText}
//                     </span>
//                   </div>

//                   <div className="text-white mb-3">
//                     <MathRenderer text={q.question || ""} />
//                   </div>

//                   {q.studentAnswer && (
//                     <div className="text-sm mb-2">
//                       <span className="text-gray-500">Your answer: </span>
//                       <span className="text-gray-300">{q.studentAnswer}</span>
//                     </div>
//                   )}

//                   <div className="text-sm mb-2">
//                     <span className="text-gray-500">Correct answer: </span>
//                     <span className="text-emerald-400">{q.correctAnswer || ""}</span>
//                   </div>

//                   {q.explanation && (
//                     <div className="mt-3 p-3 bg-gray-800 rounded-lg text-sm text-gray-400">
//                       <MathRenderer text={q.explanation} />
//                     </div>
//                   )}

//                   {q.aiFeedback && (
//                     <div className="mt-2 text-sm text-indigo-300 italic">{q.aiFeedback}</div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <div className="flex gap-3 flex-wrap">
//         <button
//           onClick={function() { navigate("/create-test"); }}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition">
//           <i className="fas fa-redo mr-2"></i>Take Another Test
//         </button>
//         <button
//           onClick={function() { navigate("/"); }}
//           className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition border border-gray-600">
//           <i className="fas fa-chart-line mr-2"></i>Dashboard
//         </button>
//         <button
//           onClick={function() { navigate("/explain"); }}
//           className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition border border-gray-600">
//           <i className="fas fa-book mr-2"></i>Study Topics
//         </button>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTest } from "../services/api";
import MathRenderer from "../components/MathRenderer";

var RTL_SUBJECTS = ["urdu", "arabic", "persian", "sindhi", "pashto", "hebrew", "kurdish", "farsi"];

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(function() {
    getTest(id)
      .then(function(r) { setTest(r.data); })
      .catch(function() { navigate("/"); })
      .finally(function() { setLoading(false); });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!test) return null;

  var isRTL = RTL_SUBJECTS.indexOf((test.subject || "").toLowerCase()) !== -1;
  var contentDir = isRTL ? "rtl" : "ltr";
  var contentAlign = isRTL ? "text-right" : "text-left";

  var correct = test.questions.filter(function(q) { return q.isCorrect; }).length;
  var incorrect = test.questions.filter(function(q) { return !q.isCorrect && !q.isSkipped; }).length;
  var skipped = test.questions.filter(function(q) { return q.isSkipped; }).length;

  var scoreColor = "red";
  if (test.percentage >= 80) scoreColor = "emerald";
  else if (test.percentage >= 50) scoreColor = "amber";

  var scoreTextClass = "text-red-400";
  if (test.percentage >= 80) scoreTextClass = "text-emerald-400";
  else if (test.percentage >= 50) scoreTextClass = "text-amber-400";

  var scoreBorderClass = "border-red-500";
  if (test.percentage >= 80) scoreBorderClass = "border-emerald-500";
  else if (test.percentage >= 50) scoreBorderClass = "border-amber-500";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          <i className="fas fa-chart-pie text-indigo-500 mr-3"></i>Test Results
        </h1>
        <p className="text-gray-500 mt-1 capitalize">{test.subject} - {test.topic} - {test.difficulty}</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center mb-6">
        <div className={"w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center mx-auto mb-4 " + scoreBorderClass}>
          <span className={"text-4xl font-bold " + scoreTextClass}>{test.percentage || 0}%</span>
          <span className="text-xs text-gray-500">Score</span>
        </div>

        {test.feedback && (
          <p className="text-gray-300 max-w-lg mx-auto mb-6">{test.feedback}</p>
        )}

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{test.obtainedMarks || 0}/{test.totalMarks || 0}</div>
            <div className="text-xs text-gray-500">Marks</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{correct}</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{incorrect}</div>
            <div className="text-xs text-gray-500">Wrong</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{skipped}</div>
            <div className="text-xs text-gray-500">Skipped</div>
          </div>
        </div>
      </div>

      {test.recommendations && test.recommendations.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="fas fa-lightbulb text-amber-500 mr-2"></i>AI Recommendations
          </h3>
          <div className="space-y-2">
            {test.recommendations.map(function(r, i) {
              return (
                <div key={i} className="bg-indigo-500/10 border-l-4 border-indigo-500 px-4 py-2.5 rounded-r-lg text-sm text-gray-300">
                  {r}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            <i className="fas fa-list-check mr-2"></i>Question Details
          </h3>
          <button
            onClick={function() { setShowDetails(function(s) { return !s; }); }}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition">
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4">
            {test.questions.map(function(q, i) {
              var statusClass = "border-red-500";
              if (q.isCorrect) statusClass = "border-emerald-500";
              else if (q.isSkipped) statusClass = "border-amber-500";

              var badgeClass = "bg-red-500/20 text-red-400";
              var badgeText = "Wrong " + (q.obtainedMarks || 0) + "/" + q.marks;
              if (q.isCorrect) {
                badgeClass = "bg-emerald-500/20 text-emerald-400";
                badgeText = "Correct " + (q.obtainedMarks || 0) + "/" + q.marks;
              } else if (q.isSkipped) {
                badgeClass = "bg-amber-500/20 text-amber-400";
                badgeText = "Skipped";
              }

              return (
                <div key={q._id || i} className={"p-5 rounded-xl bg-gray-900 " +
                  (isRTL ? "border-r-4 " : "border-l-4 ") + statusClass}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-400">
                      Q{i + 1} - {q.type === "mcq" ? "MCQ" : "Written"} - {q.marks} marks
                    </span>
                    <span className={"px-2.5 py-1 rounded-full text-xs font-semibold " + badgeClass}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Question text — RTL aware */}
                  <div dir={contentDir} className={"text-white mb-3 " + contentAlign}>
                    <MathRenderer text={q.question || ""} />
                  </div>

                  {/* Student answer — RTL aware */}
                  {q.studentAnswer && (
                    <div dir={contentDir} className={"text-sm mb-2 " + contentAlign}>
                      <span className="text-gray-500">{isRTL ? "آپ کا جواب: " : "Your answer: "}</span>
                      <span className="text-gray-300">{q.studentAnswer}</span>
                    </div>
                  )}

                  {/* Correct answer — RTL aware */}
                  <div dir={contentDir} className={"text-sm mb-2 " + contentAlign}>
                    <span className="text-gray-500">{isRTL ? "درست جواب: " : "Correct answer: "}</span>
                    <span className="text-emerald-400">{q.correctAnswer || ""}</span>
                  </div>

                  {/* Explanation — RTL aware */}
                  {q.explanation && (
                    <div dir={contentDir} className={"mt-3 p-3 bg-gray-800 rounded-lg text-sm text-gray-400 " + contentAlign}>
                      <MathRenderer text={q.explanation} />
                    </div>
                  )}

                  {/* AI Feedback — RTL aware */}
                  {q.aiFeedback && (
                    <div dir={contentDir} className={"mt-2 text-sm text-indigo-300 italic " + contentAlign}>
                      {q.aiFeedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={function() { navigate("/create-test"); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition">
          <i className="fas fa-redo mr-2"></i>Take Another Test
        </button>
        <button
          onClick={function() { navigate("/"); }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition border border-gray-600">
          <i className="fas fa-chart-line mr-2"></i>Dashboard
        </button>
        <button
          onClick={function() { navigate("/explain"); }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition border border-gray-600">
          <i className="fas fa-book mr-2"></i>Study Topics
        </button>
      </div>
    </div>
  );
}