// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useApp } from './context/AppContext';
// import Sidebar from './components/Sidebar';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import ExplainTopic from './pages/ExplainTopic';
// import CreateTest from './pages/CreateTest';
// import TakeTest from './pages/TakeTest';
// import Results from './pages/Results';

// function Protected({ children }) {
//   const { token } = useApp();
//   return token ? children : <Navigate to="/login" />;
// }

// export default function App() {
//   const { token } = useApp();

//   if (!token) {
//     return (
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     );
//   }

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <main className="flex-1 bg-dark-900 p-6">
//         <div className="max-w-5xl mx-auto">
//           <Routes>
//             <Route path="/" element={<Protected><Dashboard /></Protected>} />
//             <Route path="/explain" element={<Protected><ExplainTopic /></Protected>} />
//             <Route path="/create-test" element={<Protected><CreateTest /></Protected>} />
//             <Route path="/test/:id" element={<Protected><TakeTest /></Protected>} />
//             <Route path="/results/:id" element={<Protected><Results /></Protected>} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </div>
//       </main>
//     </div>
//   );
// }

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AITeacher from './pages/AITeacher';
import CreateTest from './pages/CreateTest';
import TakeTest from './pages/TakeTest';
import Results from './pages/Results';
import Settings from './pages/Settings';

function Protected({ children }) {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useApp();

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-dark-900 p-6">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/ai-teacher" element={<Protected><AITeacher /></Protected>} />
            <Route path="/create-test" element={<Protected><CreateTest /></Protected>} />
            <Route path="/test/:id" element={<Protected><TakeTest /></Protected>} />
            <Route path="/results/:id" element={<Protected><Results /></Protected>} />
            <Route path="/settings" element={<Protected><Settings /></Protected>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}