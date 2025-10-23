<template>
  <section>
    <h1 class="page-title">Login</h1>
    <p class="page-subtitle">Use demo credentials to access member pages.</p>

    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label" for="login-username">Username</label>
              <input
                id="login-username"
                v-model="username"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': tried && !username }"
              />
              <div v-if="tried && !username" class="invalid-feedback">Username is required.</div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="login-password">Password</label>
              <input
                id="login-password"
                v-model="password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': tried && !password }"
              />
              <div v-if="tried && !password" class="invalid-feedback">Password is required.</div>
            </div>

            <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../stores/auth'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const tried = ref(false)

function fillDemo() {
  username.value = 'admin'
  password.value = 'Password123!'
}

async function onSubmit() {
  tried.value = true
  error.value = ''
  if (!username.value || !password.value) return

  const ok = login(username.value, password.value)
  if (!ok) {
    error.value = 'Invalid credentials.'
    return
  }

  const goto = route.query.redirect || '/about'
  router.push(goto)
}
</script>
