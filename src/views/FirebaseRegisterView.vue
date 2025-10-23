<template>
  <section class="auth-wrap">
    <div class="card">
      <h1 class="title">Create an Account</h1>

      <div v-if="errorMsg" class="alert">{{ errorMsg }}</div>
      <div v-if="okMsg" class="ok">{{ okMsg }}</div>

      <div class="field">
        <label>Email</label>
        <input type="email" v-model.trim="email" placeholder="you@example.com" />
      </div>

      <div class="field">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="At least 8 chars" />
      </div>

      <div class="field">
        <label>Role</label>
        <select v-model="role">
          <option disabled value="">Please choose a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <small class="hint">You can sign in by multiple roles in the system.</small>
      </div>

      <button class="btn" @click="register" :disabled="loading">
        {{ loading ? 'Creating...' : 'Register' }}
      </button>

      <p class="muted">
        Already have an account?
        <router-link to="/FireLogin">Sign in</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/init'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const role = ref('')
const loading = ref(false)
const errorMsg = ref('')
const okMsg = ref('')

const router = useRouter()

const register = async () => {
  errorMsg.value = ''
  okMsg.value = ''

  if (!email.value || !password.value || !role.value) {
    errorMsg.value = 'Please fill in email, password, and role.'
    return
  }
  if (password.value.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters.'
    return
  }

  try {
    loading.value = true
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await setDoc(doc(db, 'users', cred.user.uid), {
      email: email.value,
      role: role.value,
      createdAt: serverTimestamp(),
    })

    okMsg.value = 'Register successful! Redirecting to sign in...'
    setTimeout(() => router.push('/FireLogin'), 600)
  } catch (err) {
    errorMsg.value = err?.code || 'Register failed'
    console.error(err)
  } finally {
    loading.value = false
  }
}
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
  max-width: 440px;
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

.field {
  display: grid;
  gap: 8px;
  margin: 14px 0;
}

.field input,
.field select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.hint {
  color: #6b7280;
  font-size: 12px;
}

.btn {
  width: 100%;
  margin-top: 10px;
  border: none;
  background: #6366f1;
  color: #fff;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  font-size: 14px;
}

.ok {
  background: #dcfce7;
  color: #166534;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  font-size: 14px;
}

.muted {
  color: #6b7280;
  font-size: 14px;
  margin-top: 14px;
  text-align: center;
}
</style>
