<template>
  <v-app :theme="theme">
    <!-- Navigation bar — hidden on auth/onboarding pages -->
    <v-app-bar v-if="showShell" color="primary" elevation="2" density="default">
      <v-app-bar-title>
        <v-icon icon="mdi-map-marker-star" class="mr-2" />
        Tunisia Tourist Guide
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn variant="text" to="/home" color="white">Home</v-btn>
        <v-btn variant="text" to="/explore" color="white">Explore</v-btn>
        <v-btn variant="text" to="/itineraries/create" color="white">Itineraries</v-btn>
        <v-btn variant="text" to="/flights" color="white">Flights</v-btn>
        <v-btn variant="text" icon color="white">
          <v-icon>mdi-bookmark-outline</v-icon>
        </v-btn>

        <!-- Settings -->
        <v-btn variant="text" icon color="white" @click="settingsDialog = true">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>

        <!-- User avatar menu -->
        <v-menu v-if="isAuthenticated" offset-y>
          <template v-slot:activator="{ props: menuProps }">
            <v-avatar
              color="secondary"
              size="36"
              class="mx-2"
              style="cursor:pointer"
              v-bind="menuProps"
            >
              <v-icon icon="mdi-account" color="white" />
            </v-avatar>
          </template>
          <v-list density="compact" min-width="200">
            <v-list-item
              prepend-icon="mdi-account-circle-outline"
              :title="currentUser?.fullName || 'My Profile'"
              :subtitle="currentUser?.email"
              :to="`/profile/${currentUser?.username || 'me'}`"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-cog-outline"
              title="Settings"
              @click="settingsDialog = true"
            />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Log out"
              base-color="error"
              @click="logout"
            />
          </v-list>
        </v-menu>

        <!-- Guest avatar (not logged in) -->
        <v-avatar
          v-else
          color="secondary"
          size="36"
          class="mx-2"
          style="cursor:pointer"
          @click="$router.push('/login')"
        >
          <v-icon icon="mdi-account" color="white" />
        </v-avatar>
      </template>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer — hidden on auth/onboarding pages -->
    <v-footer v-if="showShell" color="surface" border="t" class="py-4">
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

    <!-- Session-expired snackbar -->
    <v-snackbar
      v-model="showExpiredNotice"
      color="warning"
      timeout="5000"
      location="top"
    >
      <v-icon class="mr-2">mdi-clock-alert-outline</v-icon>
      Your session has expired. Please log in again.
      <template v-slot:actions>
        <v-btn variant="text" icon @click="showExpiredNotice = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SettingsModal from './components/SettingsModal.vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated, currentUser, authError, logout } = useAuth()

const settingsDialog = ref(false)
const theme = ref('tunisiaTheme')
const language = ref('English')
const languages = ['English', 'Arabic', 'French']

// Hide navbar/footer on login and onboarding pages
const route = useRoute()
const AUTH_ROUTES = ['/login', '/onboarding']
const showShell = computed(() => !AUTH_ROUTES.includes(route.path))

// Show a snackbar when authError contains the session-expired message
const showExpiredNotice = ref(false)
watch(authError, (msg) => {
  if (msg && msg.includes('expired')) {
    showExpiredNotice.value = true
  }
})
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
