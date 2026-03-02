<template>
  <div class="text-center py-8">
    <v-icon icon="mdi-email-fast-outline" color="primary" size="72" class="mb-4" />
    <h2 class="text-h5 font-weight-bold mb-3">Check your email</h2>
    <p class="text-body-1 text-medium-emphasis mb-6">
      We've sent a verification link to your email.<br />
      Click the link to verify your account.
    </p>
    <v-btn color="primary" variant="outlined" @click="$emit('resend')">
      <v-icon start>mdi-email-sync-outline</v-icon>Resend Email
    </v-btn>
    <div class="text-caption text-medium-emphasis mt-4">
      Didn't receive it? Check your spam folder.
    </div>
  </div>
</template>

<script setup>
defineEmits(['resend'])
</script>
