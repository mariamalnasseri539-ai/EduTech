import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCurrentUserToken } from './firebaseConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Enterprise Axios client pre-configured with Firebase Bearer Token Interceptor.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 45000,
});

// Request Interceptor: Injects current Firebase ID Token into Authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getCurrentUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback for offline dev mode if no live user is logged in
        const devToken = localStorage.getItem('dev_auth_token');
        if (devToken) {
          config.headers.Authorization = `Bearer ${devToken}`;
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve Firebase ID token for outgoing request:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardizes error handling and 401 session expirations
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request detected. Redirecting to authentication.');
      // Optional: Dispatch auth expiration event or redirect
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication & Identity API Services
 */
export interface SyncUserResponse {
  success: boolean;
  message?: string;
  user: {
    id: string;
    firebase_uid: string;
    email: string;
    display_name: string;
    role: 'STD' | 'ADM';
    placement_completed: boolean;
    enrolled_courses: string[];
    created_at: string;
    last_login_at?: string;
  };
  role: 'STD' | 'ADM';
  placement_completed: boolean;
}

export const authApi = {
  /**
   * Synchronizes authenticated Firebase user with Laravel backend and Cloud Firestore
   */
  async syncUser(displayName?: string): Promise<SyncUserResponse> {
    const res = await apiClient.post<SyncUserResponse>('/auth/sync-user', {
      display_name: displayName,
    });
    return res.data;
  },

  /**
   * Retrieves current authenticated user profile
   */
  async getMe(): Promise<SyncUserResponse> {
    const res = await apiClient.get<SyncUserResponse>('/auth/me');
    return res.data;
  },
};

export default apiClient;
