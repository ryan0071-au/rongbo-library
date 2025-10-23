<template>
  <div class="row">
    <div class="col-md-8 offset-md-2">
      <header class="page-header mb-4 text-center">
        <div class="d-inline-flex align-items-center">
          <span class="me-2" style="font-size: 1.6rem">🗂️</span>
          <h1 class="h2 mb-0">W5. Library Registration Form</h1>
        </div>
        <p class="text-muted subtitle mb-0">
          Let's build some more advanced features into our form.
        </p>
      </header>

      <form @submit.prevent="submitForm">
        <!-- Username & Gender -->
        <div class="row mb-3">
          <div class="col-md-6 col-sm-6">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !formData.username || !!errors.username }"
              id="username"
              v-model="formData.username"
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>
          <div class="col-md-6 col-sm-6">
            <label for="gender" class="form-label">Gender</label>
            <select
              class="form-select"
              id="gender"
              v-model="formData.gender"
              :class="{ 'is-invalid': errors.gender }"
            >
              <option value="">-- Select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div class="invalid-feedback" v-if="errors.gender">{{ errors.gender }}</div>
          </div>
        </div>

        <!-- Password & Confirm Password -->
        <div class="row mb-3">
          <div class="col-md-6 col-sm-6">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': !formData.password || !!errors.password }"
              id="password"
              v-model="formData.password"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <div class="col-md-6 col-sm-6">
            <label for="confirm-password" class="form-label">Confirm password</label>
            <input
              type="password"
              class="form-control"
              id="confirm-password"
              v-model="formData.confirmPassword"
              @blur="() => validateConfirmPassword(true)"
            />
            <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
            </div>
          </div>
        </div>

        <!-- Resident -->
        <div class="row mb-3">
          <div class="col-md-6 col-sm-6">
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="isAustralian"
                v-model="formData.isAustralian"
              />
              <label class="form-check-label" for="isAustralian">Australian Resident?</label>
            </div>
          </div>
        </div>

        <!-- Reason for joining -->
        <div class="mb-3">
          <label for="reason" class="form-label">Reason for joining</label>
          <textarea
            class="form-control"
            id="reason"
            rows="3"
            v-model="formData.reason"
            :class="{ 'is-invalid': errors.reason }"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.reason">{{ errors.reason }}</div>

          <!-- Green Friend -->
          <small v-if="showsFriendPraise" class="text-success d-block mt-1">
            Great to have a friend
          </small>
        </div>

        <!-- Suburb -->
        <div class="mb-3">
          <label for="suburb" class="form-label">Suburb</label>
          <input type="text" class="form-control" id="suburb" v-model="formData.suburb" />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary me-2">Submit</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
        </div>

        <!-- Datatable -->
        <DataTable
          v-if="submittedCards.length"
          :value="submittedCards"
          class="mt-5"
          tableStyle="min-width: 50rem"
        >
          <Column field="username" header="Username" />
          <Column field="password" header="Password" />
          <Column field="isAustralian" header="Australian Resident" />
          <Column field="gender" header="Gender" />
          <Column field="reason" header="Reason" />
          <Column field="suburb" header="Suburb" />
        </DataTable>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const MIN_REASON_LEN = 10

const INITIAL_FORM = {
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton',
}

const formData = ref({ ...INITIAL_FORM })
const submittedCards = ref([])

const errors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  gender: '',
  reason: '',
})

/** Username check */
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = ''
  }
}

/** Password check */
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = ''
  }
}

/**
 * Confirm password check
 * @param {boolean} blur
 */
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = ''
  }
}

/** Green Friend */
const showsFriendPraise = computed(() => {
  const text = formData.value.reason || ''
  return /\bfriend\b/i.test(text)
})

/** Total check */
const validate = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)

  errors.value.gender = formData.value.gender ? '' : 'Please select your gender.'
  errors.value.reason =
    formData.value.reason && formData.value.reason.trim().length >= MIN_REASON_LEN
      ? ''
      : `Reason must be at least ${MIN_REASON_LEN} characters.`

  return (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.gender &&
    !errors.value.reason
  )
}

const submitForm = () => {
  if (!validate()) return
  submittedCards.value.push({ ...formData.value })
}

const clearForm = () => {
  Object.assign(formData.value, INITIAL_FORM)
  errors.value.username = ''
  errors.value.password = ''
  errors.value.confirmPassword = ''
  errors.value.gender = ''
  errors.value.reason = ''
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
</style>
