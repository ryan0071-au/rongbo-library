import { ref, computed } from 'vue'

const HARD_USER = 'admin'
const HARD_PASS = 'Password123!'

export const isAuthenticated = ref(JSON.parse(localStorage.getItem('auth') || 'false'))
export const currentUser = computed(() => (isAuthenticated.value ? { username: HARD_USER } : null))

export function login(username, password) {
  const ok = username === HARD_USER && password === HARD_PASS
  isAuthenticated.value = ok
  localStorage.setItem('auth', JSON.stringify(ok))
  return ok
}

export function logout() {
  isAuthenticated.value = false
  localStorage.setItem('auth', 'false')
}
