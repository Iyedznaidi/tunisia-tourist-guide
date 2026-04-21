<template>
  <v-container class="py-8">
    <!-- Search bar -->
    <v-text-field
      v-model="search"
      placeholder="Search destinations, activities..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      rounded="lg"
      class="mb-6"
      hide-details
      bg-color="white"
      clearable
    />

    <!-- Filter row -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="3">
        <v-select v-model="filterLocation" :items="locations" label="Location" clearable hide-details />
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="filterInterest" :items="interestOptions" label="Interest" clearable hide-details />
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="filterRating" :items="ratingOptions" label="Min Rating" clearable hide-details />
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="filterSort" :items="sortOptions" label="Sort By" hide-details />
      </v-col>
    </v-row>

    <!-- Activity Grid -->
    <v-row>
      <v-col v-for="place in filteredPlaces" :key="place.id" cols="12" sm="6" md="4" lg="3">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            rounded="xl"
            height="100%"
            style="transition: elevation 0.2s"
            :to="`/activity/${place.id}`"
          >
            <v-img :src="place.image" height="160" cover>
              <template v-slot:placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>
            <v-card-title class="pb-1 text-body-1">{{ place.name }}</v-card-title>
            <v-card-subtitle>
              <v-icon size="14">mdi-map-marker</v-icon> {{ place.city }}
            </v-card-subtitle>
            <v-card-text class="pt-1">
              <div class="d-flex flex-wrap ga-1 mb-2">
                <v-chip v-for="tag in place.tags" :key="tag" size="x-small" color="primary" variant="tonal">{{ tag }}</v-chip>
              </div>
              <v-rating :model-value="place.rating" density="compact" size="small" color="amber" readonly />
              <p class="text-caption text-medium-emphasis mt-1">{{ place.description }}</p>
            </v-card-text>
            <v-card-actions v-if="isHovering">
              <v-btn color="primary" variant="tonal" size="small">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Empty state -->
    <EmptyState v-if="filteredPlaces.length === 0" title="No activities found" description="Try adjusting your filters" icon="mdi-magnify-remove-outline" />

    <!-- Pagination -->
    <div class="d-flex justify-center mt-8">
      <v-pagination v-model="page" :length="5" color="primary" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import { useActivities } from '../composables/useActivities'

const search = ref('')
const filterLocation = ref(null)
const filterInterest = ref(null)
const filterRating = ref(null)
const filterSort = ref('Popularity')
const page = ref(1)

const locations = ['Tunis', 'Hammamet', 'Sousse', 'Douz', 'Djerba', 'Sfax', 'El Jem', 'Sidi Bou Said', 'Bizerte']
const interestOptions = ['Sea', 'Desert', 'Hiking', 'Culture', 'Food', 'History', 'City Life', 'Music', 'Nature', 'Adventure']
const ratingOptions = ['4.5+', '4.0+', '3.5+']
const sortOptions = ['Popularity', 'Rating', 'Newest']

const { activities: places, fetchActivities } = useActivities()

onMounted(() => {
  fetchActivities()
})

const filteredPlaces = computed(() => {
  let result = places.value
  if (search.value) result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()) || p.city.toLowerCase().includes(search.value.toLowerCase()))
  if (filterLocation.value) result = result.filter(p => p.city === filterLocation.value)
  if (filterInterest.value) result = result.filter(p => p.tags.includes(filterInterest.value))
  if (filterRating.value) {
    const min = parseFloat(filterRating.value)
    result = result.filter(p => p.rating >= min)
  }
  if (filterSort.value === 'Rating') result = [...result].sort((a, b) => b.rating - a.rating)
  return result
})
</script>
