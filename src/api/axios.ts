import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

export const api = axios.create({
  baseURL,
})

// 🔑 Helpers for token management
export function setToken(token: string) {
  localStorage.setItem("token", token)
}

export function getToken() {
  return localStorage.getItem("token")
}

export function clearToken() {
  localStorage.removeItem("token")
}

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
