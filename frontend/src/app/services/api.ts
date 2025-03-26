import axios from 'axios';

// Définition des URLs de base pour chaque microservice
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';

const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}:3001/api`,
  USER: `${API_BASE_URL}:3002/api`,
  EVENT: `${API_BASE_URL}:3003/api`,
  TICKET: `${API_BASE_URL}:3004/api`,
  PAYMENT: `${API_BASE_URL}:3005/api`,
  NOTIFICATION: `${API_BASE_URL}:3006/api`,
};

// Création d'instances axios pour chaque service
const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Intercepteur pour ajouter le token d'authentification
  instance.interceptors.request.use(
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

  // Intercepteur pour gérer les erreurs
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Gérer les erreurs 401 (non authentifié)
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Création des API clients
export const authApi = createAxiosInstance(API_ENDPOINTS.AUTH);
export const userApi = createAxiosInstance(API_ENDPOINTS.USER);
export const eventApi = createAxiosInstance(API_ENDPOINTS.EVENT);
export const ticketApi = createAxiosInstance(API_ENDPOINTS.TICKET);
export const paymentApi = createAxiosInstance(API_ENDPOINTS.PAYMENT);
export const notificationApi = createAxiosInstance(API_ENDPOINTS.NOTIFICATION);

// Services API
export const authService = {
  login: (email: string, password: string) => 
    authApi.post('/auth/login', { email, password }),
  register: (userData: any) => 
    authApi.post('/auth/register', userData),
  refreshToken: () => 
    authApi.post('/auth/refresh-token'),
  logout: () => 
    authApi.post('/auth/logout'),
};

export const userService = {
  getProfile: () => 
    userApi.get('/users/profile'),
  updateProfile: (profileData: any) => 
    userApi.put('/users/profile', profileData),
  getPurchaseHistory: () => 
    userApi.get('/users/purchases'),
};

export const eventService = {
  getAllEvents: (params?: any) => 
    eventApi.get('/events', { params }),
  getEvent: (id: string) => 
    eventApi.get(`/events/${id}`),
  getCategories: () => 
    eventApi.get('/events/categories'),
  searchEvents: (query: string) => 
    eventApi.get('/events/search', { params: { query } }),
};

export const ticketService = {
  createReservation: (reservationData: any) => 
    ticketApi.post('/tickets/reservations', reservationData),
  getReservation: (id: string) => 
    ticketApi.get(`/tickets/reservations/${id}`),
  getUserTickets: () => 
    ticketApi.get('/tickets/users/me'),
  getTicket: (id: string) => 
    ticketApi.get(`/tickets/${id}`),
};

export const paymentService = {
  processPayment: (paymentData: any) => 
    paymentApi.post('/payments', paymentData),
  getTransaction: (id: string) => 
    paymentApi.get(`/payments/${id}`),
};
