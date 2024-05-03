import axios from 'axios'

const baseURL = 'http://localhost:3000/api' // Replace with your backend API URL

axios.defaults.baseURL = baseURL

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token') // Adjust based on your storage mechanism

    if (token) {
      // Attach token to Authorization header if it exists
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default axios // Optional: Export the configured Axios instance
