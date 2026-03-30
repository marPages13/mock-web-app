import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear local auth state and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Import router lazily to avoid circular dependency
      import('../router').then(({ default: router }) => {
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push('/login');
        }
      });
    }
    return Promise.reject(error);
  },
);
