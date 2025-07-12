const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User registration
  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User login
  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Google OAuth authentication
  async googleAuth(token) {
    return this.request('/users/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Get user profile
  async getProfile() {
    return this.request('/users/profile');
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Check profile completion status
  async checkProfileCompletion() {
    return this.request('/users/profile');
  }

  // Get user stats
  async getUserStats() {
    return this.request('/users/stats');
  }

  // Get public users (for browsing)
  async getPublicUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  // Get user by ID
  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }
}

export const apiService = new ApiService();
export default apiService; 