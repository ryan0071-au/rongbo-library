<template>
  <header class="d-flex justify-content-center">
    <ul class="nav nav-pills align-items-center">
      <li class="nav-item">
        <router-link to="/" class="nav-link" active-class="active" aria-current="page">
          Home
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/AddBook" class="nav-link" active-class="active">
          Manage Book
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/GetBookCount" class="nav-link" active-class="active">
          Get Book Count
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/CountBookAPI" class="nav-link" active-class="active">
          Count Book API
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/WeatherCheck" class="nav-link" active-class="active">
          Get Weather
        </router-link>
      </li>

      <li class="nave-item">
        <router-link to="/Firelogin" class="nav-link" active-class="active"
          >Firebase Login</router-link
        >
      </li>
      <li class="nave-item">
        <router-link to="/FireRegister" class="nav-link" active-class="active"
          >Firebase Register</router-link
        >
      </li>

      <li class="nav-item">
        <router-link to="/about" class="nav-link" active-class="active"> About </router-link>
      </li>

      <li class="nav-item ms-3" v-if="!isAuthenticated">
        <router-link to="/login" class="btn btn-outline-primary btn-sm">Login</router-link>
      </li>
      <li class="nav-item ms-3" v-else>
        <button class="btn btn-outline-secondary btn-sm" @click="handleLogout">Logout</button>
      </li>
    </ul>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../stores/auth'

const router = useRouter()
function handleLogout() {
  logout()
  router.push('/login')
}
</script>
