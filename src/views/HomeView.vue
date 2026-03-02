<template>
  <div>
    <!-- Hero Section -->
    <v-img
      src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600"
      height="520"
      cover
      class="hero-img"
    >
      <div class="hero-overlay d-flex flex-column align-center justify-center fill-height text-center pa-6">
        <h1 class="text-h3 font-weight-bold text-white mb-3">Discover Tunisia, tailored for you</h1>
        <p class="text-h6 text-white mb-6" style="opacity:.9">Beaches, Deserts, Medinas & More</p>
        <div class="d-flex ga-3">
          <v-btn color="primary" size="large" rounded="lg" to="/explore">
            <v-icon start>mdi-compass</v-icon>Start Exploring
          </v-btn>
          <v-btn variant="outlined" size="large" rounded="lg" color="white" to="/itineraries/create">
            View Itineraries
          </v-btn>
        </div>
      </div>
    </v-img>

    <v-container class="py-8">
      <!-- Interest shortcut chips -->
      <div class="mb-2 text-subtitle-2 text-medium-emphasis">Browse by interest</div>
      <div class="d-flex flex-wrap ga-2 mb-8">
        <v-chip
          v-for="chip in interestChips"
          :key="chip.label"
          :prepend-icon="chip.icon"
          color="primary"
          variant="tonal"
          size="large"
          clickable
          @click="$router.push('/explore')"
        >{{ chip.label }}</v-chip>
      </div>

      <!-- Featured Destinations -->
      <div class="text-h5 font-weight-bold mb-4">Featured Destinations</div>
      <v-slide-group show-arrows class="mb-8">
        <v-slide-group-item v-for="dest in featured" :key="dest.name">
          <v-card
            width="260"
            rounded="xl"
            class="mx-2"
            :to="`/activity/${dest.id}`"
          >
            <v-img :src="dest.image" height="160" cover />
            <v-card-title class="pb-1">{{ dest.name }}</v-card-title>
            <v-card-subtitle class="pb-2">
              <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>{{ dest.city }}
              <v-rating
                :model-value="dest.rating"
                density="compact"
                size="small"
                color="amber"
                readonly
                class="ml-2 d-inline-flex"
              />
            </v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" variant="tonal" size="small" :to="`/activity/${dest.id}`">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <!-- Quick links -->
      <v-row>
        <v-col cols="12" md="4" v-for="link in quickLinks" :key="link.title">
          <v-card
            :color="link.color"
            variant="tonal"
            rounded="xl"
            class="pa-5 text-center"
            :to="link.to"
            hover
          >
            <v-icon :icon="link.icon" size="40" :color="link.iconColor" />
            <div class="text-h6 font-weight-bold mt-2">{{ link.title }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ link.desc }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const interestChips = [
  { label: 'Sea & Beach', icon: 'mdi-waves' },
  { label: 'Desert', icon: 'mdi-terrain' },
  { label: 'Hiking', icon: 'mdi-hiking' },
  { label: 'Culture', icon: 'mdi-theater' },
  { label: 'Food', icon: 'mdi-food' },
  { label: 'History', icon: 'mdi-bank' },
]

const featured = [
  { id: 1, name: 'Medina of Tunis', city: 'Tunis', rating: 4.8, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400' },
  { id: 2, name: 'Sahara Desert Tour', city: 'Douz', rating: 4.9, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400' },
  { id: 3, name: 'Hammamet Beach', city: 'Hammamet', rating: 4.7, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 4, name: 'El Jem Amphitheatre', city: 'El Jem', rating: 4.8, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400' },
  { id: 5, name: 'Sidi Bou Said', city: 'Tunis', rating: 4.6, image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400' },
]

const quickLinks = [
  { title: 'Plan an Itinerary', desc: 'Build your perfect Tunisia trip', icon: 'mdi-calendar-edit', color: 'primary', iconColor: 'primary', to: '/itineraries/create' },
  { title: 'Find Flights', desc: 'Search flights to Tunisia', icon: 'mdi-airplane', color: 'secondary', iconColor: 'secondary', to: '/flights' },
  { title: 'For You', desc: 'Personalised recommendations', icon: 'mdi-star-circle', color: 'accent', iconColor: 'accent', to: '/for-you' },
]
</script>

<style scoped>
.hero-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.55));
}
</style>
