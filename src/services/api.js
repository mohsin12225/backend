// import axios from 'axios';

// var BASE_URL = 'http://localhost:5000/api';

// var API = axios.create({ baseURL: BASE_URL });

// API.interceptors.request.use(function(config) {
//   var token = localStorage.getItem('eduai_token');
//   if (token) config.headers.Authorization = 'Bearer ' + token;
//   return config;
// });

// API.interceptors.response.use(
//   function(res) { return res; },
//   function(err) {
//     if (err.response && err.response.status === 401) {
//       localStorage.removeItem('eduai_token');
//       localStorage.removeItem('eduai_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export var register = function(data) { return API.post('/auth/register', data); };
// export var login = function(data) { return API.post('/auth/login', data); };

// export var explainTopic = function(data) { return API.post('/ai/explain', data); };
// export var askDoubt = function(data) { return API.post('/ai/doubt', data); };

// export var generateTest = function(data) { return API.post('/test/generate', data); };
// export var getTest = function(id) { return API.get('/test/' + id); };
// export var submitTest = function(id, data) { return API.post('/test/' + id + '/submit', data); };
// export var getMyTests = function() { return API.get('/test/my-tests'); };

// export var getDashboard = function() { return API.get('/performance/dashboard'); };

// export default API;

import axios from 'axios';

var BASE_URL = 'http://localhost:5000/api';

var API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use(function(config) {
  var token = localStorage.getItem('eduai_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

API.interceptors.response.use(
  function(res) { return res; },
  function(err) {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('eduai_token');
      localStorage.removeItem('eduai_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export var register = function(data) { return API.post('/auth/register', data); };
export var login = function(data) { return API.post('/auth/login', data); };

export var explainTopic = function(data) { return API.post('/ai/explain', data); };
export var askDoubt = function(data) { return API.post('/ai/doubt', data); };

export var aiTeacherChat = function(data) { return API.post('/ai-teacher/chat', data); };

export var generateTest = function(data) { return API.post('/test/generate', data); };
export var getTest = function(id) { return API.get('/test/' + id); };
export var submitTest = function(id, data) { return API.post('/test/' + id + '/submit', data); };
export var getMyTests = function() { return API.get('/test/my-tests'); };

export var getDashboard = function() { return API.get('/performance/dashboard'); };

export default API;