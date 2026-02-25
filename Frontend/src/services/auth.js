// services/auth.js
class AuthService {
  constructor() {
    this.tokenKey = 'token'
    this.userKey = 'user'
    this.usersKey = 'users'
  }

  // Initialize with some test users (optional - remove for production)
  initTestUsers() {
    const users = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        city: 'Johannesburg',
        createdAt: new Date().toISOString()
      }
    ]
    
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify(users))
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey)
    return userStr ? JSON.parse(userStr) : null
  }

  // Get token
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser()
  }

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }
}

export default new AuthService()