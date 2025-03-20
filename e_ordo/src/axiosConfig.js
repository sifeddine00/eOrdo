import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Assurez-vous d'ajuster l'URL
  withCredentials: true, // Cela permet d'envoyer les cookies
});

// Intercepteur pour ajouter le token CSRF
api.interceptors.request.use(
  (config) => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;



