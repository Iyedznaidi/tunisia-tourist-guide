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
import { ref, computed } from 'vue'
import EmptyState from '../components/EmptyState.vue'

const search = ref('')
const filterLocation = ref(null)
const filterInterest = ref(null)
const filterRating = ref(null)
const filterSort = ref('Popularity')
const page = ref(1)

const locations = ['Tunis', 'Hammamet', 'Sousse', 'Douz', 'Djerba', 'Sfax', 'El Jem', 'Sidi Bou Said']
const interestOptions = ['Sea', 'Desert', 'Hiking', 'Culture', 'Food', 'History', 'City Life', 'Music']
const ratingOptions = ['4.5+', '4.0+', '3.5+']
const sortOptions = ['Popularity', 'Rating', 'Newest']

const places = ref([
  { id: 1, name: 'Medina of Tunis', city: 'Tunis', tags: ['Culture', 'History'], rating: 4.8, description: 'Explore UNESCO-listed winding alleyways and souks.', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400' },
  { id: 2, name: 'Sahara Desert Tour', city: 'Douz', tags: ['Desert', 'Adventure'], rating: 4.9, description: 'Ride camels and camp under Saharan skies.', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400' },
  { id: 3, name: 'Hammamet Beach', city: 'Hammamet', tags: ['Sea', 'Relax'], rating: 4.7, description: 'Crystal clear Mediterranean waters.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 4, name: 'El Jem Amphitheatre', city: 'El Jem', tags: ['History'], rating: 4.8, description: 'One of the best-preserved Roman colosseums.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400' },
  { id: 5, name: 'Sidi Bou Said', city: 'Tunis', tags: ['Culture', 'City Life'], rating: 4.6, description: 'The iconic blue-and-white village.', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400' },
  { id: 6, name: 'Djerba Island', city: 'Djerba', tags: ['Sea', 'Relax'], rating: 4.7, description: 'Island getaway with pristine beaches.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400' },
  { id: 7, name: 'Bardo Museum', city: 'Tunis', tags: ['History', 'Culture'], rating: 4.5, description: 'Home to the world\'s finest collection of Roman mosaics.', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400' },
  { id: 8, name: 'Ichkeul National Park', city: 'Bizerte', tags: ['Hiking', 'Nature'], rating: 4.4, description: 'UNESCO biosphere reserve with diverse wildlife.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
])

const filteredPlaces = computed(() => {
  let result = places.value
  if (search.value) result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()) || p.city.toLowerCase().includes(search.value.toLowerCase()))
  if (filterLocation.value) result = result.filter(p => p.city === filterLocation.value)
  if (filterInterest.value) result = result.filter(p => p.tags.includes(filterInterest.value))
  return result
})
</script>
