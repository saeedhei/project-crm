<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="email">Username/Email:</label>
      <input type="text" id="email" v-model="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
    </div>
    <button type="submit">Login</button>
    <br />
    <br />
  </form>
  <button @click="logout">Logout</button>
  <div v-if="errorMessage">{{ errorMessage }}</div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth' // Adjust path as needed
import { useRouter } from 'vue-router'
// import axios from '../axios-vip'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const authStore = useAuthStore()
    const errorMessage = ref('')
    const router = useRouter()

    const handleSubmit = async () => {
      try {
        await authStore.login({ email: email.value, password: password.value })
        router.push('/account') // Redirect to /profile on successful login
      } catch (error) {
        console.error(error)
        errorMessage.value = 'Login failed. Please check your credentials.'
      }

      // axios
      //   .get('/protected')
      //   .then((response) => {
      //     errorMessage.value = response.data // Handle successful response                  teeeeeeeeeeeeeeeeeeeest
      //   })
      //   .catch((error) => {
      //     console.error(error) // Handle errors
      //   })
    }

    const logout = async () => {
      try {
        await authStore.logout()
        await router.push('/login')
      } catch (error) {
        console.error(error)
        errorMessage.value = 'Lougout failed...'
      }
    }
    return { email, password, handleSubmit, logout, errorMessage }
  }
}

// const logout = async () => {
//   try {
//     // Call the logout function from the auth store
//     await authStore.logout()
//     // Add any further actions here, such as navigation
//     // For example: this.$router.push('/login');
//   } catch (error) {
//     // Handle error (e.g., display error message)
//     errorMessage.value = 'Failed to logout: ' + (error as Error).message
//   }
// }
</script>
