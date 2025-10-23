<template>
  <section class="auth-wrap">
    <div class="card">
      <template v-if="!user">
        <h1 class="title">Sign in</h1>

        <p class="roles">
          You can sign in by multiple roles: <b>Tracker</b>, <b>Researcher</b>, <b>Admin</b>.
        </p>

        <div v-if="errorMsg" class="alert">{{ errorMsg }}</div>

        <div class="field">
          <label>Email</label>
          <input type="email" v-model.trim="email" placeholder="you@example.com" />
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Your password" />
        </div>

        <button class="btn" @click="signin" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
        </button>

        <p class="muted">
          No account yet?
          <router-link to="/FireRegister">Create an account</router-link>
        </p>
      </template>

      <template v-else>
        <h1 class="title">Welcome</h1>

        <div class="idcard">
          <div class="row">
            <span class="k">Email</span>
            <span class="v">{{ user.email }}</span>
          </div>
          <div class="row">
            <span class="k">UID</span>
            <span class="v">{{ user.uid }}</span>
          </div>
          <div class="row">
            <span class="k">Role</span>
            <span class="v">{{ role || '—' }}</span>
          </div>
        </div>

        <div class="actions">
          <router-link class="btn ghost" to="/">Go Home</router-link>
          <button class="btn danger" @click="logout">Log out</button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/init.js'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const user = ref(null)
const role = ref('')

const router = useRouter()

const signin = async () => {
  errorMsg.value = ''
  try {
    loading.value = true
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    user.value = cred.user

    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    role.value = snap.exists() ? snap.data().role || '' : ''

    console.log('✅ Firebase Login Successful!')
    console.log('Current User:', auth.currentUser)
    console.log('Role:', role.value)
  } catch (err) {
    errorMsg.value = err?.code || 'Sign-in failed'
    console.error('❌ Sign-in error:', err)
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await signOut(auth)
  user.value = null
  role.value = ''
  email.value = ''
  password.value = ''
  console.log('👋 Logged out.')
}

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (u) {
      const snap = await getDoc(doc(db, 'users', u.uid))
      role.value = snap.exists() ? snap.data().role || '' : ''
      console.log('🔄 Auth state changed: user logged in', u)
      console.log('Role:', role.value)
    } else {
      role.value = ''
      console.log('🔄 Auth state changed: user logged out')
    }
  })
})
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7f8fb;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 28px;
}
.title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
}
.roles {
  color: #374151;
  background: #f3f4f6;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
}
.field {
  display: grid;
  gap: 8px;
  margin: 14px 0;
}
.field input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.field input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.btn {
  display: inline-block;
  border: none;
  background: #6366f1;
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.ghost {
  background: #eef2ff;
  color: #3730a3;
  margin-right: 8px;
}
.btn.danger {
  background: #ef4444;
}
.alert {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 10px;
  margin: 10px 0;
  font-size: 14px;
}
.muted {
  color: #6b7280;
  font-size: 14px;
  margin-top: 14px;
  text-align: center;
}
.idcard {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
}
.idcard .row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
  padding: 6px 0;
}
.idcard .k {
  color: #6b7280;
}
.idcard .v {
  color: #111827;
  word-break: break-all;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
