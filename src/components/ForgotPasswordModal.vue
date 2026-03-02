<template>
  <v-dialog v-model="dialog" max-width="440" persistent>
    <v-card rounded="xl" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold pb-0">
        <v-icon color="primary" class="mr-2">mdi-lock-reset</v-icon>
        Reset Password
      </v-card-title>
      <v-card-subtitle class="pt-1 pb-4">
        Enter your email and we'll send you a reset link.
      </v-card-subtitle>

      <v-card-text class="pb-0">
        <!-- Success state -->
        <template v-if="sent">
          <div class="text-center py-4">
            <v-icon color="success" size="56">mdi-email-check-outline</v-icon>
            <div class="text-subtitle-1 font-weight-medium mt-3">Reset link sent!</div>
            <div class="text-body-2 text-medium-emphasis mt-1">
              Check <strong>{{ sentEmail }}</strong> for a password reset link.
            </div>
          </div>
        </template>

        <!-- Email input -->
        <template v-else>
          <v-text-field
            v-model="email"
            label="Email address"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            :error-messages="emailError"
            @keyup.enter="send"
          />
        </template>
      </v-card-text>

      <v-card-actions class="pt-2">
        <v-spacer />
        <v-btn variant="text" @click="close">{{ sent ? 'Close' : 'Cancel' }}</v-btn>
        <v-btn
          v-if="!sent"
          color="primary"
          variant="flat"
          :loading="loading"
          @click="send"
        >
          Send reset link
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const dialog = ref(props.modelValue)
const email = ref('')
const emailError = ref('')
const loading = ref(false)
const sent = ref(false)
const sentEmail = ref('')

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
    if (val) {
      // Reset state when dialog opens
      email.value = ''
      emailError.value = ''
      sent.value = false
      sentEmail.value = ''
      loading.value = false
    }
  },
)
watch(dialog, (val) => emit('update:modelValue', val))

function send() {
  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Please enter your email address.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  loading.value = true
  // Mock async delay
  setTimeout(() => {
    loading.value = false
    sentEmail.value = email.value
    sent.value = true
  }, 1200)
}

function close() {
  dialog.value = false
}
</script>
