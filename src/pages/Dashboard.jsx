import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => {
  return sessionStorage.getItem("dashboard_welcome_shown") !== "true";
});
  const [animateStats, setAnimateStats] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  const [animateRest, setAnimateRest] = useState(false);
  const [motivationVisible, setMotivationVisible] = useState(false);
  const navigate = useNavigate();

  // Get user name from localStorage
  var userData = null;
  try {
    var stored = localStorage.getItem('eduai_user');
    if (stored) userData = JSON.parse(stored);
  } catch(e) {}
  var userName = (userData && userData.name) ? userData.name : 'Student';
  var firstName = userName.split(' ')[0];

  // Get greeting based on time
  function getGreeting() {
    var hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  }

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Staggered animation triggers
  useEffect(() => {
    if (!loading) {
      var t0 = setTimeout(function() { setMotivationVisible(true); }, 200);
      var t1 = setTimeout(function() { setAnimateStats(true); }, 400);
      var t2 = setTimeout(function() { setAnimateCharts(true); }, 800);
      var t3 = setTimeout(function() { setAnimateRest(true); }, 1100);
      var t4 = setTimeout(function() {
  setShowWelcome(false);
  sessionStorage.setItem("dashboard_welcome_shown", "true");
}, 4000);
      return function() {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [loading]);

  if (loading) return <Loader text="Loading dashboard..." />;

  const os = data?.overallStats || { totalTests: 0, avgScore: 0, totalQuestions: 0, accuracy: 0 };
  const ss = data?.subjectStats || {};
  const recent = data?.recentTests || [];
  const motivationMessage = data?.motivationMessage || '';

  const subjectLabels = Object.keys(ss);
  const barData = {
    labels: subjectLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{
      label: 'Avg Score %',
      data: subjectLabels.map(s => ss[s].averageScore),
      backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderRadius: 8, barThickness: 40
    }]
  };

  const doughnutData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [os.totalCorrect || 0, (os.totalQuestions || 0) - (os.totalCorrect || 0)],
      backgroundColor: ['#10b981', '#ef4444'], borderWidth: 0
    }]
  };

  // Motivational message based on performance (fallback)
  function getMotivation() {
    if (os.totalTests === 0) return "Start your first test and begin your learning journey! 🚀";
    if (os.avgScore >= 80) return "Outstanding performance! You're on fire! 🔥";
    if (os.avgScore >= 60) return "Great progress! Keep pushing higher! 💪";
    if (os.avgScore >= 40) return "You're improving! Practice makes perfect! 📈";
    return "Every expert was once a beginner. Keep going! 🌟";
  }

  return (
    <div>
      {/* ═══════════════════════════════════════════ */}
      {/*  WELCOME LANDING ANIMATION                 */}
      {/* ═══════════════════════════════════════════ */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/95 backdrop-blur-sm"
          style={{
            animation: 'fadeOut 0.5s ease-in-out 3.5s forwards'
          }}>
          <div className="text-center" style={{ animation: 'welcomeSlideUp 0.6s ease-out' }}>
            {/* Animated Icon */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl"
                style={{ animation: 'welcomePulse 2s ease-in-out infinite' }}></div>
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30"
                style={{ animation: 'welcomeIconBounce 0.8s ease-out' }}>
                <i className="fas fa-graduation-cap text-3xl text-white"></i>
              </div>
            </div>

            {/* Greeting */}
            <p className="text-indigo-400 text-sm font-medium tracking-wider uppercase mb-2"
              style={{ animation: 'welcomeFadeIn 0.5s ease-out 0.3s both' }}>
              {getGreeting()}
            </p>
            <h1 className="text-4xl font-bold text-white mb-3"
              style={{ animation: 'welcomeFadeIn 0.5s ease-out 0.5s both' }}>
              Welcome back, <span className="text-indigo-400">{firstName}</span>!
            </h1>
            <p className="text-gray-400 text-lg"
              style={{ animation: 'welcomeFadeIn 0.5s ease-out 0.7s both' }}>
              {getMotivation()}
            </p>

            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1.5 mt-6"
              style={{ animation: 'welcomeFadeIn 0.5s ease-out 1s both' }}>
              <div className="w-2 h-2 bg-indigo-500 rounded-full" style={{ animation: 'welcomeDot 1.4s ease-in-out infinite' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full" style={{ animation: 'welcomeDot 1.4s ease-in-out 0.2s infinite' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full" style={{ animation: 'welcomeDot 1.4s ease-in-out 0.4s infinite' }}></div>
            </div>
          </div>
        </div>
      )}

      
      <style>{`
        @keyframes welcomeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomePulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes welcomeIconBounce {
          0% { transform: scale(0) rotate(-10deg); }
          60% { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes welcomeDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes statCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chartIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes restIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes motivationIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes coachGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.15); }
          50% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
        }
      `}</style>




     {/* ═══════════════════════════════════════════ */}
     {/*  DASHBOARD HEADER                          */}
     {/* ═══════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <i className="fas fa-chart-line text-indigo-500 mr-3"></i>Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Track your progress and performance</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
            <i className="fas fa-user-circle text-indigo-400"></i>
            <span className="text-sm text-gray-300">{userName}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  AI STUDY COACH — Motivational Message     */}
      {/* ═══════════════════════════════════════════ */}
      {motivationMessage && (
        <div className="mb-6"
          style={motivationVisible
            ? { animation: 'motivationIn 0.6s ease-out both' }
            : { opacity: 0 }}>
          <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-5"
            style={{ animation: 'coachGlow 3s ease-in-out infinite' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                <i className="fas fa-robot text-white text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-indigo-400">AI Study Coach</h3>
                  <span className="px-1.5 py-0.5 bg-indigo-500/20 rounded text-[10px] text-indigo-300 font-medium uppercase tracking-wider">Personalized</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{motivationMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/*  QUICK ACTIONS BAR                         */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-3 mb-8"
        style={animateStats ? { animation: 'statCardIn 0.4s ease-out both' } : { opacity: 0 }}>
        <button onClick={function() { navigate('/ai-teacher'); }}
          className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-500/50 rounded-xl px-5 py-3 text-sm text-gray-300 hover:text-white transition flex items-center gap-2 group">
          <i className="fas fa-chalkboard-teacher text-indigo-400 group-hover:scale-110 transition-transform"></i>
          AI Teacher
        </button>
        <button onClick={function() { navigate('/create-test'); }}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-3 text-sm text-white font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 group">
          <i className="fas fa-rocket group-hover:scale-110 transition-transform"></i>
          Create New Test
        </button>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  STATS GRID — Animated                     */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: 'fas fa-pen-to-square', value: os.totalTests, label: 'Tests Taken', color: 'indigo', emoji: '📝' },
          { icon: 'fas fa-chart-bar', value: os.avgScore + '%', label: 'Avg Score', color: 'cyan', emoji: '📊' },
          { icon: 'fas fa-circle-question', value: os.totalQuestions, label: 'Questions', color: 'emerald', emoji: '❓' },
          { icon: 'fas fa-bullseye', value: os.accuracy + '%', label: 'Accuracy', color: 'amber', emoji: '🎯' }
        ].map(function(stat, i) {
          return (
            <div key={i}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center hover:border-gray-600 transition group"
              style={animateStats
                ? { animation: 'statCardIn 0.5s ease-out ' + (i * 0.1) + 's both' }
                : { opacity: 0 }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.emoji}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  CHARTS — Animated                         */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8"
        style={animateCharts ? { animation: 'chartIn 0.5s ease-out both' } : { opacity: 0 }}>
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            <i className="fas fa-chart-bar text-indigo-400 mr-2"></i>Subject Performance
          </h3>
          <div className="h-64">
            {subjectLabels.length > 0
              ? <Bar data={barData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#6b7280' }, grid: { color: '#1f2937' } },
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } }
                  }
                }} />
              : <div className="h-full flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <i className="fas fa-chart-simple text-3xl mb-2"></i>
                    <p>Take tests to see performance data</p>
                  </div>
                </div>}
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            <i className="fas fa-bullseye text-emerald-400 mr-2"></i>Accuracy
          </h3>
          <div className="h-64 flex items-center justify-center">
            {os.totalQuestions > 0
              ? <Doughnut data={doughnutData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#9ca3af' } } }
                }} />
              : <div className="text-gray-600 text-sm text-center">
                  <i className="fas fa-circle-dot text-3xl mb-2"></i>
                  <p>No data yet</p>
                </div>}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  STRENGTHS & WEAKNESSES — Animated         */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid md:grid-cols-2 gap-6 mb-8"
        style={animateRest ? { animation: 'restIn 0.5s ease-out both' } : { opacity: 0 }}>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="fas fa-arrow-trend-up text-emerald-500 mr-2"></i>Strengths
          </h3>
          {(data?.strengths || []).length > 0
            ? data.strengths.map(function(s, i) {
              return (
                <div key={i} className="bg-emerald-500/10 border-l-4 border-emerald-500 px-4 py-2 rounded-r-lg mb-2 text-sm text-gray-300">{s}</div>
              );
            })
            : <p className="text-gray-600 text-sm">Take more tests to see strengths</p>}
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="fas fa-arrow-trend-down text-red-500 mr-2"></i>Needs Work
          </h3>
          {(data?.weaknesses || []).length > 0
            ? data.weaknesses.map(function(w, i) {
              return (
                <div key={i} className="bg-red-500/10 border-l-4 border-red-500 px-4 py-2 rounded-r-lg mb-2 text-sm text-gray-300">{w}</div>
              );
            })
            : <p className="text-gray-600 text-sm">Take more tests to identify weak areas</p>}
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  RECENT TESTS — Animated                   */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        style={animateRest ? { animation: 'restIn 0.5s ease-out 0.2s both' } : { opacity: 0 }}>
        <h3 className="text-lg font-semibold text-white mb-4">
          <i className="fas fa-clock-rotate-left text-indigo-400 mr-2"></i>Recent Tests
        </h3>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="text-left py-3 px-2">Subject</th>
                  <th className="text-left py-3 px-2">Topic</th>
                  <th className="text-left py-3 px-2">Difficulty</th>
                  <th className="text-left py-3 px-2">Score</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {recent.map(function(t) {
                  return (
                    <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-750 transition">
                      <td className="py-3 px-2 capitalize text-white">{t.subject}</td>
                      <td className="py-3 px-2 text-gray-300">{t.topic}</td>
                      <td className="py-3 px-2">
                        <span className={"px-2 py-0.5 rounded-full text-xs font-medium " +
                          (t.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400'
                          : t.difficulty === 'hard' ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400')}>
                          {t.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={"font-semibold " +
                          (t.percentage >= 70 ? 'text-emerald-400'
                          : t.percentage >= 40 ? 'text-amber-400'
                          : 'text-red-400')}>
                          {t.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-2">
                        <button onClick={function() { navigate('/results/' + t.id); }}
                          className="text-indigo-400 hover:text-indigo-300 text-xs transition">
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <i className="fas fa-pen-to-square text-4xl mb-3 block"></i>
            <p className="mb-4">No tests yet. Start your first test!</p>
            <button onClick={function() { navigate('/create-test'); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm transition shadow-lg shadow-indigo-600/20">
              <i className="fas fa-rocket mr-2"></i>Create Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Loader({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-gray-400 font-medium">{text}</p>
      <p className="text-gray-600 text-sm mt-1">Preparing your learning dashboard...</p>
    </div>
  );
}