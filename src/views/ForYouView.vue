<template>
  <v-container class="py-8">
    <div class="text-h4 font-weight-bold mb-2">For You</div>
    <p class="text-medium-emphasis mb-6">Recommendations based on your interests</p>

    <v-row>
      <!-- Sidebar Filters -->
      <v-col cols="12" md="3">
        <v-card rounded="xl" class="pa-4 mb-4" elevation="1">
          <div class="text-subtitle-1 font-weight-bold mb-3">Filters</div>

          <div class="text-body-2 font-weight-medium mb-2">Interests</div>
          <v-chip-group v-model="selectedInterests" multiple column class="mb-4">
            <v-chip v-for="i in interests" :key="i" filter color="primary" size="small">{{ i }}</v-chip>
          </v-chip-group>

          <div class="text-body-2 font-weight-medium mb-2">City</div>
          <v-select v-model="selectedCity" :items="cities" label="All cities" clearable class="mb-4" />

          <div class="text-body-2 font-weight-medium mb-2">Price Range</div>
          <v-range-slider
            v-model="priceRange"
            :min="0" :max="500"
            step="10"
            color="primary"
            thumb-label
            class="mb-4"
          />
          <div class="d-flex justify-space-between text-caption text-medium-emphasis">
            <span>{{ priceRange[0] }} TND</span>
            <span>{{ priceRange[1] }} TND</span>
          </div>

          <div class="text-body-2 font-weight-medium mb-2 mt-2">Difficulty</div>
          <v-chip-group v-model="selectedDifficulty" column>
            <v-chip filter color="primary" size="small">Easy</v-chip>
            <v-chip filter color="warning" size="small">Moderate</v-chip>
            <v-chip filter color="error" size="small">Hard</v-chip>
          </v-chip-group>
        </v-card>
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" md="9">
        <!-- Activity Cards Grid -->
        <v-row>
          <v-col v-for="activity in activities" :key="activity.id" cols="12" sm="6" lg="4">
            <v-card rounded="xl" height="100%">
              <div style="position:relative">
                <v-img :src="activity.image" height="180" cover />
                <!-- Bookmark -->
                <v-btn
                  icon
                  :color="activity.saved ? 'primary' : 'white'"
                  variant="flat"
                  size="small"
                  style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.85)"
                  @click="activity.saved = !activity.saved"
                >
                  <v-icon>{{ activity.saved ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}</v-icon>
                </v-btn>
              </div>
              <v-card-title class="pb-1 text-body-1 font-weight-bold">{{ activity.name }}</v-card-title>
              <v-card-subtitle class="pb-2">
                <v-icon size="14">mdi-map-marker</v-icon> {{ activity.city }}
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <div class="d-flex flex-wrap ga-1 mb-2">
                  <v-chip v-for="tag in activity.tags" :key="tag" size="x-small" color="secondary" variant="tonal">{{ tag }}</v-chip>
                </div>
                <v-rating
                  :model-value="activity.rating"
                  density="compact"
                  size="small"
                  color="amber"
                  readonly
                />
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" variant="tonal" size="small" :to="`/activity/${activity.id}`">View Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- People with similar interests -->
        <div class="text-h6 font-weight-bold mt-8 mb-4">People with similar interests</div>
        <v-row>
          <v-col v-for="user in similarUsers" :key="user.username" cols="12" sm="6" md="4">
            <v-card rounded="xl" class="pa-4 d-flex flex-column align-center text-center">
              <v-avatar color="secondary" size="56" class="mb-2">
                <v-icon color="white" size="28">mdi-account</v-icon>
              </v-avatar>
              <div class="text-subtitle-2 font-weight-bold">{{ user.name }}</div>
              <div class="text-caption text-medium-emphasis mb-2">@{{ user.username }}</div>
              <div class="d-flex flex-wrap justify-center ga-1 mb-3">
                <v-chip v-for="t in user.interests" :key="t" size="x-small" color="primary" variant="tonal">{{ t }}</v-chip>
              </div>
              <v-btn variant="outlined" size="small" color="primary" :to="`/profile/${user.username}`">View Profile</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActivities } from '../composables/useActivities'

const interests = ['Sea', 'Desert', 'Hiking', 'Culture', 'Food', 'History']
const cities = ['Tunis', 'Hammamet', 'Sousse', 'Douz', 'Djerba', 'Sfax', 'El Jem']
const selectedInterests = ref([])
const selectedCity = ref(null)
const priceRange = ref([0, 300])
const selectedDifficulty = ref(null)

const difficultyLabels = ['Easy', 'Moderate', 'Hard']

const { activities: allActivities, fetchActivities } = useActivities()

onMounted(() => {
  fetchActivities()
})

const activities = computed(() => {
  let result = allActivities.value
  if (selectedInterests.value.length > 0) {
    const chosen = selectedInterests.value.map((i) => interests[i])
    result = result.filter((a) => a.tags.some((t) => chosen.includes(t)))
  }
  if (selectedCity.value) {
    result = result.filter((a) => a.city === selectedCity.value)
  }
  if (selectedDifficulty.value !== null && selectedDifficulty.value !== undefined) {
    const label = difficultyLabels[selectedDifficulty.value]
    if (label) result = result.filter((a) => a.difficulty === label)
  }
  // Price filter: parse numeric value from strings like "25 TND", "Free", "90 TND"
  result = result.filter((a) => {
    if (a.price === 'Free' || a.price === '0') return priceRange.value[0] <= 0
    const num = parseInt(a.price)
    if (isNaN(num)) return true
    return num >= priceRange.value[0] && num <= priceRange.value[1]
  })
  return result
})

const similarUsers = [
  { name: 'Amira Ben Ali', username: 'amira_b', interests: ['Desert', 'Hiking', 'Food'] },
  { name: 'Karim Trabelsi', username: 'karim_t', interests: ['Culture', 'History'] },
  { name: 'Sana Mzali', username: 'sana_m', interests: ['Sea', 'Relax', 'Music'] },
]
</script>
