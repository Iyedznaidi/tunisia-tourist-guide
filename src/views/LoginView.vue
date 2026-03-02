<template>
  <v-container class="fill-height d-flex align-center justify-center" style="min-height:80vh">
    <v-col cols="12" sm="8" md="5" lg="4">
      <!-- Card container toggling between login and sign-up -->
      <v-card class="pa-6" elevation="4" rounded="xl">
        <div class="text-center mb-6">
          <v-icon icon="mdi-map-marker-star" color="primary" size="48" />
          <div class="text-h5 font-weight-bold mt-2">Tunisia Tourist Guide</div>
          <div class="text-subtitle-2 text-medium-emphasis">{{ isSignup ? 'Create your account' : 'Welcome back!' }}</div>
        </div>

        <!-- Login Form -->
        <template v-if="!isSignup && !showVerification">
          <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email-outline" class="mb-3" />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-1"
          />
          <div class="text-right mb-4">
            <a
              href="#"
              class="text-caption"
              style="color:#E07A2F"
              @click.prevent="forgotDialog = true"
            >Forgot password?</a>
          </div>

          <v-btn color="primary" block size="large" @click="handleLogin" class="mb-3">Log in</v-btn>

          <v-divider class="my-4"><span class="text-caption text-medium-emphasis px-2">OR</span></v-divider>

          <v-btn variant="outlined" block @click="isSignup = true">Create an account</v-btn>
        </template>

        <!-- Sign-up Form -->
        <template v-else-if="isSignup">
          <v-text-field v-model="fullName" label="Full Name" prepend-inner-icon="mdi-account-outline" class="mb-3" />
          <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email-outline" class="mb-3" />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-3"
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check-outline"
            class="mb-3"
          />
          <v-checkbox v-model="agreeTerms" label="I agree to the Terms & Conditions" density="compact" class="mb-3" />

          <v-btn color="primary" block size="large" @click="handleSignup" class="mb-3">Sign up</v-btn>
          <v-btn variant="text" block @click="isSignup = false">Already have an account? Log in</v-btn>
        </template>

        <!-- Email Verification -->
        <EmailVerification v-else-if="showVerification" @resend="handleResend" />
      </v-card>

      <!-- Login Error Snackbar -->
      <v-snackbar v-model="loginError" color="error" timeout="4000" location="top">
        <v-icon class="mr-2">mdi-alert-circle</v-icon>
        {{ errorMessage }}
        <template v-slot:actions>
          <v-btn variant="text" icon @click="loginError = false"><v-icon>mdi-close</v-icon></v-btn>
        </template>
      </v-snackbar>
    </v-col>

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal v-model="forgotDialog" />
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EmailVerification from '../components/EmailVerification.vue'
import ForgotPasswordModal from '../components/ForgotPasswordModal.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, signup, authError } = useAuth()

const isSignup = ref(false)
const showVerification = ref(false)
const showPassword = ref(false)
const loginError = ref(false)
const errorMessage = ref('')
const forgotDialog = ref(false)

const email = ref('')
const password = ref('')
const fullName = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)

// Mirror authError into local error snackbar
watch(authError, (msg) => {
  if (msg) {
    errorMessage.value = msg
    loginError.value = true
  }
})

function handleLogin() {
  const ok = login(email.value, password.value)
  if (!ok) return

  // Redirect: if user hasn't completed onboarding, send them there first
  const onboarded = localStorage.getItem('ttg_onboarded')
  if (!onboarded) {
    router.push('/onboarding')
  } else {
    router.push('/home')
  }
}

function handleSignup() {
  if (!agreeTerms.value) {
    errorMessage.value = 'Please agree to the Terms & Conditions.'
    loginError.value = true
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    loginError.value = true
    return
  }
  const ok = signup(fullName.value, email.value, password.value)
  if (!ok) return

  showVerification.value = true
  isSignup.value = false
}

function handleResend() {
  // Mock resend
}
</script>
