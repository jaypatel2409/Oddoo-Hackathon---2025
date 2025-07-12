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

  // Review methods
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async getUserReviews(userId, page = 1, limit = 10) {
    return this.request(`/reviews/user/${userId}?page=${page}&limit=${limit}`);
  }

  async getMyReviews(page = 1, limit = 10) {
    return this.request(`/reviews/my-reviews?page=${page}&limit=${limit}`);
  }

  async canReviewUser(userId) {
    return this.request(`/reviews/can-review/${userId}`);
  }

  // Swap methods
  async createSwapRequest(swapData) {
    return this.request('/swaps', {
      method: 'POST',
      body: JSON.stringify(swapData),
    });
  }

  async getSwapRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/swaps?${queryString}`);
  }

  async getSwapRequestById(swapId) {
    return this.request(`/swaps/${swapId}`);
  }

  async updateSwapStatus(swapId, status) {
    return this.request(`/swaps/${swapId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelSwapRequest(swapId) {
    return this.request(`/swaps/${swapId}/cancel`, {
      method: 'PUT',
    });
  }

  async addSwapFeedback(swapId, feedbackData) {
    return this.request(`/swaps/${swapId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  // Admin methods
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  async updateUserStatus(userId, statusData) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async updateSkillApproval(userId, skillName, isApproved) {
    return this.request(`/admin/users/${userId}/skills/${encodeURIComponent(skillName)}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    });
  }

  async getAdminMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/messages?${queryString}`);
  }

  async createAdminMessage(messageData) {
    return this.request('/admin/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async updateAdminMessage(messageId, messageData) {
    return this.request(`/admin/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
    });
  }

  async deleteAdminMessage(messageId) {
    return this.request(`/admin/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async downloadReport(reportType, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/reports/${reportType}?${queryString}`);
  }

  async getPublicMessages() {
    return this.request('/admin/messages/public');
  }
}

export const apiService = new ApiService();
export default apiService; 