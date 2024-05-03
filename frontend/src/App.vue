<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

async function handleTokenAndRedirect(token: string | null) {
  const authStore = useAuthStore()
  if (token === null) {
    router.push('/login')
    return
  }
  await authStore.setToken(token)

  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    router.push('/account')
  }
}

const token = localStorage.getItem('jwt_token')
if (token) {
  handleTokenAndRedirect(token)
}
</script>

<template>
  <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <HelloWorld msg="You did it!" />
    <RouterLink to="/">Home</RouterLink> -->
  <!-- <RouterLink to="/about">About</RouterLink> -->

  <RouterView />
</template>

<style scoped lang="scss">
$line-h: 1.5;
</style>
