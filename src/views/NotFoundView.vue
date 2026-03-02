<template>
  <v-container class="fill-height d-flex align-center justify-center text-center" style="min-height:70vh">
    <v-col cols="12" sm="8" md="5">
      <v-icon icon="mdi-compass-off-outline" color="primary" size="96" class="mb-4" />
      <h1 class="text-h4 font-weight-bold mb-3">You seem lost in the desert</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <v-btn color="primary" size="large" to="/home">
        <v-icon start>mdi-home</v-icon>Go Back Home
      </v-btn>
    </v-col>
  </v-container>
</template>

<script setup>
</script>
