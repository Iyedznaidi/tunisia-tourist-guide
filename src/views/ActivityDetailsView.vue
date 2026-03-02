<template>
  <div>
    <!-- Header Image -->
    <v-img :src="activity.image" height="380" cover>
      <div class="fill-height" style="background:linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))">
        <v-container class="fill-height d-flex flex-column justify-end pb-6">
          <h1 class="text-h3 font-weight-bold text-white">{{ activity.name }}</h1>
          <div class="d-flex flex-wrap ga-2 mt-2">
            <v-chip v-for="tag in activity.tags" :key="tag" color="primary" size="small">{{ tag }}</v-chip>
          </div>
        </v-container>
      </div>
    </v-img>

    <v-container class="py-8">
      <v-row>
        <!-- Main content -->
        <v-col cols="12" md="8">
          <!-- Info Row -->
          <v-card rounded="xl" class="pa-5 mb-6">
            <v-row align="center">
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-map-marker</v-icon>
                <div class="text-caption">Location</div>
                <div class="text-body-2 font-weight-bold">{{ activity.city }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-clock-outline</v-icon>
                <div class="text-caption">Duration</div>
                <div class="text-body-2 font-weight-bold">{{ activity.duration }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-hiking</v-icon>
                <div class="text-caption">Difficulty</div>
                <div class="text-body-2 font-weight-bold">{{ activity.difficulty }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-weather-sunny</v-icon>
                <div class="text-caption">Best Season</div>
                <div class="text-body-2 font-weight-bold">{{ activity.season }}</div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Description -->
          <div class="text-h6 font-weight-bold mb-2">About</div>
          <p class="text-body-1 text-medium-emphasis mb-6">{{ activity.description }}</p>

          <!-- Action buttons -->
          <div class="d-flex ga-3 mb-8">
            <v-btn color="primary" size="large" @click="addToItineraryDialog = true">
              <v-icon start>mdi-calendar-plus</v-icon>Add to Itinerary
            </v-btn>
            <v-btn variant="outlined" color="primary" size="large" @click="reviewDialog = true">
              <v-icon start>mdi-star-plus-outline</v-icon>Add Review
            </v-btn>
          </div>

          <!-- Reviews Section -->
          <div class="text-h6 font-weight-bold mb-4">Reviews ({{ reviews.length }})</div>
          <v-card v-for="review in reviews" :key="review.id" rounded="xl" class="mb-3 pa-4">
            <div class="d-flex align-center mb-2">
              <v-avatar color="secondary" size="36" class="mr-3">
                <v-icon color="white" size="18">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold">{{ review.user }}</div>
                <div class="text-caption text-medium-emphasis">{{ review.date }}</div>
              </div>
              <v-spacer />
              <v-rating :model-value="review.rating" density="compact" size="small" color="amber" readonly />
            </div>
            <p class="text-body-2">{{ review.text }}</p>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" class="pa-5 mb-4" elevation="3">
            <div class="text-h5 font-weight-bold text-primary mb-1">{{ activity.price }}</div>
            <div class="text-caption text-medium-emphasis mb-4">per person</div>
            <v-rating :model-value="activity.rating" density="comfortable" color="amber" readonly class="mb-4" />
            <v-btn color="primary" block size="large" @click="addToItineraryDialog = true">Book this Activity</v-btn>
          </v-card>

          <!-- Related Activities -->
          <div class="text-subtitle-1 font-weight-bold mb-3">Related Activities</div>
          <v-card
            v-for="rel in related"
            :key="rel.id"
            rounded="xl"
            class="mb-3"
            :to="`/activity/${rel.id}`"
          >
            <v-row no-gutters align="center">
              <v-col cols="4">
                <v-img :src="rel.image" height="70" cover rounded="lg" />
              </v-col>
              <v-col cols="8" class="pa-3">
                <div class="text-body-2 font-weight-bold">{{ rel.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ rel.city }}</div>
                <v-rating :model-value="rel.rating" density="compact" size="x-small" color="amber" readonly />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Modals -->
    <AddReviewModal v-model="reviewDialog" />
    <AddToItineraryModal v-model="addToItineraryDialog" :activity="activity" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddReviewModal from '../components/AddReviewModal.vue'
import AddToItineraryModal from '../components/AddToItineraryModal.vue'

const route = useRoute()
const reviewDialog = ref(false)
const addToItineraryDialog = ref(false)

// Mock activity data (in a real app, fetch by route.params.id)
const activity = ref({
  id: route.params.id,
  name: 'Medina of Tunis',
  city: 'Tunis',
  tags: ['Culture', 'History', 'UNESCO'],
  rating: 4.8,
  price: '25 TND',
  duration: '3–4 hours',
  difficulty: 'Easy',
  season: 'Spring / Autumn',
  description: 'The Medina of Tunis is a UNESCO World Heritage Site and one of the finest examples of Arab-Muslim civilisation. Wander through winding streets lined with mosques, palaces, and bustling souks.',
  image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200',
})

const reviews = ref([
  { id: 1, user: 'Amira B.', date: 'Feb 2024', rating: 5, text: 'Absolutely magical place. The souks are full of life!' },
  { id: 2, user: 'Karim T.', date: 'Jan 2024', rating: 4, text: 'Rich history and culture. A must-visit for history lovers.' },
  { id: 3, user: 'Sana M.', date: 'Dec 2023', rating: 5, text: 'Stunning architecture. Highly recommend the guided tour.' },
])

const related = ref([
  { id: 5, name: 'Sidi Bou Said', city: 'Tunis', rating: 4.6, image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200' },
  { id: 7, name: 'Bardo Museum', city: 'Tunis', rating: 4.5, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=200' },
  { id: 4, name: 'El Jem Amphitheatre', city: 'El Jem', rating: 4.8, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200' },
])
</script>
