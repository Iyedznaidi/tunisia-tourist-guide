<template>
  <v-app :theme="theme">
    <!-- Top Navigation Bar -->
    <v-app-bar color="primary" elevation="2" density="default">
      <v-app-bar-title>
        <v-icon icon="mdi-map-marker-star" class="mr-2" />
        Tunisia Tourist Guide
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn variant="text" to="/home" color="white">Home</v-btn>
        <v-btn variant="text" to="/explore" color="white">Explore</v-btn>
        <v-btn variant="text" to="/itineraries/create" color="white">Itineraries</v-btn>
        <v-btn variant="text" to="/flights" color="white">Flights</v-btn>
        <v-btn variant="text" to="/profile/me" color="white">Profile</v-btn>
        <v-btn variant="text" icon color="white">
          <v-icon>mdi-bookmark-outline</v-icon>
        </v-btn>

        <!-- Settings -->
        <v-btn variant="text" icon color="white" @click="settingsDialog = true">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>

        <!-- Avatar -->
        <v-avatar color="secondary" size="36" class="mx-2" style="cursor:pointer" @click="$router.push('/profile/me')">
          <v-icon icon="mdi-account" color="white" />
        </v-avatar>
      </template>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer color="surface" border="t" class="py-4">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="4">
            <span class="text-h6 font-weight-bold" style="color:#E07A2F">
              <v-icon icon="mdi-map-marker-star" class="mr-1" />Tunisia Tourist Guide
            </span>
            <div class="text-caption text-medium-emphasis mt-1">Discover Tunisia, tailored for you</div>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center ga-3">
            <v-btn variant="text" size="small" to="/about">About</v-btn>
            <v-btn variant="text" size="small" to="/contact">Contact</v-btn>
            <v-btn variant="text" size="small" to="/terms">Terms</v-btn>
            <v-btn variant="text" size="small" to="/privacy">Privacy</v-btn>
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-center justify-end ga-2">
            <!-- Social icons -->
            <v-btn icon variant="text" size="small">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="small">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="small">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <!-- Language selector -->
            <v-select
              v-model="language"
              :items="languages"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width:110px"
            />
          </v-col>
        </v-row>
        <v-divider class="my-3" />
        <div class="text-center text-caption text-medium-emphasis">
          © 2024 Tunisia Tourist Guide. All rights reserved.
        </div>
      </v-container>
    </v-footer>

    <!-- Settings Modal -->
    <SettingsModal v-model="settingsDialog" @update:theme="theme = $event" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import SettingsModal from './components/SettingsModal.vue'

const settingsDialog = ref(false)
const theme = ref('tunisiaTheme')
const language = ref('English')
const languages = ['English', 'Arabic', 'French']
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
