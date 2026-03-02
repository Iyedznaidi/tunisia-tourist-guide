<template>
  <v-container class="py-10" style="max-width:820px">
    <div class="text-center mb-8">
      <v-icon icon="mdi-compass-rose" color="primary" size="56" />
      <h1 class="text-h4 font-weight-bold mt-3">What are you interested in?</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Select topics to personalise your Tunisia experience</p>
    </div>

    <!-- Interest grid -->
    <v-row justify="center">
      <v-col
        v-for="interest in interests"
        :key="interest.label"
        cols="6" sm="4" md="3"
      >
        <v-card
          :color="interest.selected ? 'primary' : 'surface'"
          :variant="interest.selected ? 'flat' : 'outlined'"
          class="text-center pa-4 interest-card"
          rounded="xl"
          style="cursor:pointer"
          @click="interest.selected = !interest.selected"
        >
          <v-icon :icon="interest.icon" :color="interest.selected ? 'white' : 'primary'" size="36" />
          <div
            class="text-subtitle-2 font-weight-medium mt-2"
            :class="interest.selected ? 'text-white' : ''"
          >{{ interest.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center mt-10">
      <v-btn
        color="primary"
        size="x-large"
        block
        style="max-width:400px; margin:0 auto"
        :disabled="selectedCount === 0"
        @click="$router.push('/for-you')"
      >
        Continue
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      <div class="text-caption text-medium-emphasis mt-2">
        {{ selectedCount }} interest{{ selectedCount !== 1 ? 's' : '' }} selected
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const interests = ref([
  { label: 'Sea', icon: 'mdi-waves', selected: false },
  { label: 'Desert', icon: 'mdi-terrain', selected: false },
  { label: 'Hiking', icon: 'mdi-hiking', selected: false },
  { label: 'Camping', icon: 'mdi-campfire', selected: false },
  { label: 'Culture', icon: 'mdi-theater', selected: false },
  { label: 'Music', icon: 'mdi-music', selected: false },
  { label: 'Food', icon: 'mdi-food', selected: false },
  { label: 'History', icon: 'mdi-bank', selected: false },
  { label: 'City Life', icon: 'mdi-city', selected: false },
])

const selectedCount = computed(() => interests.value.filter(i => i.selected).length)
</script>

<style scoped>
.interest-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.interest-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
}
</style>
