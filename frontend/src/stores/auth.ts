import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '../axios-vip' // Configured

interface User {
  email: string
  // Add other user properties if needed
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>('/login', credentials)
      const { token: newToken, user: newUser } = response.data
      token.value = newToken
      user.value = newUser
      isLoggedIn.value = true
      localStorage.setItem('jwt_token', newToken) // Or consider secure storage
    } catch (error) {
      console.error(error)
      // Handle login errors
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('jwt_token')
  }

  const setToken = async (newToken: string) => {
    token.value = newToken
    if (await validateToken()) {
      isLoggedIn.value = true
    } else {
      // Handle invalid token (e.g., clear storage, redirect to login)
    }
  }

  const validateToken = async (): Promise<boolean> => {
    try {
      // Call your backend API endpoint to validate the token
      const response = await axios.get('/auth/validate')
      return response.data.isValid // Replace with your validation response format
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  const isAuthenticated = computed(() => isLoggedIn.value)
  const currentUser = computed(() => user.value)

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    setToken,
    validateToken,
    isAuthenticated,
    currentUser
  }
})

// computed = getters
// import { defineStore } from 'pinia'
// import axios from '../axios-vip' // Configuried

// interface User {
//   email: string
//   // Add other user properties if needed
// }

// interface AuthState {
//   token: string | null
//   user: User | null
//   isLoggedIn: boolean
// }

// export const useAuthStore = defineStore('auth', {
//   state: (): AuthState => ({
//     token: null,
//     user: null,
//     isLoggedIn: false
//   }),
//   actions: {
//     async login(credentials: { email: string; password: string }) {
//       try {
//         const response = await axios.post<{ token: string; user: User }>('/login', credentials)
//         const { token, user } = response.data
//         this.token = token
//         this.user = user
//         this.isLoggedIn = true
//         localStorage.setItem('jwt_token', token) // Or consider secure storage
//       } catch (error) {
//         console.error(error)
//         // Handle login errors
//       }
//     },
//     logout() {
//       this.token = null
//       this.user = null
//       this.isLoggedIn = false
//       localStorage.removeItem('jwt_token')
//     },
//     async setToken(token: string) {
//       this.token = token
//       if (await this.validateToken()) {
//         this.isLoggedIn = true
//       } else {
//         // Handle invalid token (e.g., clear storage, redirect to login)
//       }
//     },
//     async validateToken(): Promise<boolean> {
//       try {
//         // Call your backend API endpoint to validate the token
//         const response = await axios.get('/auth/validate')
//         return response.data.isValid // Replace with your validation response format
//       } catch (error) {
//         console.error('Error validating token:', error)
//         return false
//       }
//     }
//   },
//   getters: {
//     isAuthenticated(state): boolean {
//       return state.isLoggedIn
//     },
//     currentUser(state): User | null {
//       return state.user
//     }
//   }
// })
