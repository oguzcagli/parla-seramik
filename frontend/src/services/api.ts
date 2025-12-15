import axios from 'axios';
import toast from 'react-hot-toast';

// Production'da Render backend URL'i, development'ta proxy kullan
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message || 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error(errorMessage);
            // Sadece login sayfasında değilsek yönlendir
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
