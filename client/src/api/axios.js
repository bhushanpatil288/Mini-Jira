// ============================================================
// Axios Instance
// ============================================================
// A pre-configured Axios instance that automatically attaches
// the JWT token from localStorage to every request.
// ============================================================

import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
});

// ---- Request Interceptor ----
// Before every request, read the token from localStorage and
// add it to the Authorization header if it exists.
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
