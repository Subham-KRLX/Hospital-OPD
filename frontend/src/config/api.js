// API configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

// Helper function for API calls with auth
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return response
}

export default API_URL
