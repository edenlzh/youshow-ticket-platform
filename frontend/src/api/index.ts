import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// 可以在此添加拦截器配置，如token
// instance.interceptors.request.use(config => {...});

export default instance;
