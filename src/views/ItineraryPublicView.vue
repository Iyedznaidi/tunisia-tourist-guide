<template>
  <v-container class="py-8">
    <!-- Header: user info + itinerary cover -->
    <v-card rounded="xl" class="mb-6 overflow-hidden" elevation="3">
      <v-img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200" height="240" cover>
        <div class="fill-height d-flex flex-column justify-end pa-6" style="background:linear-gradient(to top,rgba(0,0,0,0.65),transparent)">
          <h1 class="text-h4 font-weight-bold text-white">{{ itinerary.title }}</h1>
          <div class="text-body-2 text-white mt-1" style="opacity:.85">
            {{ itinerary.startDate }} → {{ itinerary.endDate }} · {{ itinerary.days.length }} days
          </div>
        </div>
      </v-img>
      <v-card-text class="pa-4">
        <div class="d-flex align-center flex-wrap ga-3">
          <v-avatar color="secondary" size="40">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-bold">{{ itinerary.author.name }}</div>
            <div class="text-caption text-medium-emphasis">@{{ itinerary.author.username }}</div>
          </div>
          <v-spacer />
          <v-btn color="primary" variant="tonal" size="small">
            <v-icon start>mdi-bookmark-outline</v-icon>Save
          </v-btn>
          <v-btn variant="outlined" size="small">
            <v-icon start>mdi-share-variant</v-icon>Share
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <!-- Day-by-day -->
        <div v-for="(day, i) in itinerary.days" :key="i" class="mb-8">
          <div class="d-flex align-center mb-3">
            <v-chip color="primary" size="large">Day {{ i + 1 }} · {{ day.date }}</v-chip>
          </div>

          <v-card
            v-for="(act, j) in day.activities"
            :key="j"
            rounded="xl"
            class="mb-3"
          >
            <v-row no-gutters align="center">
              <v-col cols="4" sm="3">
                <v-img :src="act.image" height="90" cover rounded="lg" />
              </v-col>
              <v-col cols="8" sm="9" class="pa-4">
                <div class="text-caption text-medium-emphasis">{{ act.time }}</div>
                <div class="text-subtitle-2 font-weight-bold">{{ act.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ act.note }}</div>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <!-- Photo Gallery -->
        <div class="text-h6 font-weight-bold mb-3">Trip Photos</div>
        <v-row class="mb-8">
          <v-col v-for="(photo, i) in itinerary.photos" :key="i" cols="6" sm="4">
            <v-img
              :src="photo"
              height="140"
              cover
              rounded="lg"
              class="cursor-pointer"
              @click="openLightbox(i)"
            />
          </v-col>
        </v-row>

        <!-- Comments -->
        <div class="text-h6 font-weight-bold mb-4">Comments</div>
        <v-textarea
          v-model="newComment"
          label="Share your thoughts..."
          variant="outlined"
          rows="3"
          class="mb-3"
        />
        <v-btn color="primary" @click="postComment" class="mb-6">Post Comment</v-btn>

        <v-card v-for="comment in comments" :key="comment.id" rounded="xl" class="mb-3 pa-4">
          <div class="d-flex align-center mb-1">
            <v-avatar color="secondary" size="30" class="mr-2">
              <v-icon color="white" size="14">mdi-account</v-icon>
            </v-avatar>
            <span class="text-subtitle-2 font-weight-bold">{{ comment.user }}</span>
            <v-spacer />
            <span class="text-caption text-medium-emphasis">{{ comment.date }}</span>
          </div>
          <p class="text-body-2 ml-8">{{ comment.text }}</p>
        </v-card>
      </v-col>

      <!-- Sidebar: similar itineraries -->
      <v-col cols="12" md="4">
        <div class="text-subtitle-1 font-weight-bold mb-3">Similar Itineraries</div>
        <v-card
          v-for="sim in similar"
          :key="sim.id"
          rounded="xl"
          class="mb-3"
          :to="`/itineraries/${sim.id}`"
        >
          <v-img :src="sim.image" height="100" cover />
          <v-card-title class="text-body-2 pb-1">{{ sim.title }}</v-card-title>
          <v-card-subtitle>{{ sim.days }} days · by {{ sim.author }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lightbox -->
    <ImageLightbox v-model="lightboxOpen" :photos="itinerary.photos" :initialIndex="lightboxIndex" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import ImageLightbox from '../components/ImageLightbox.vue'

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const newComment = ref('')

function openLightbox(index) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function postComment() {
  if (!newComment.value.trim()) return
  comments.value.unshift({ id: Date.now(), user: 'You', date: 'Just now', text: newComment.value })
  newComment.value = ''
}

const itinerary = ref({
  title: 'Best of Tunisia in 7 Days',
  startDate: 'March 10, 2024',
  endDate: 'March 17, 2024',
  author: { name: 'Amira Ben Ali', username: 'amira_b' },
  photos: [
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
  ],
  days: [
    {
      date: 'March 10',
      activities: [
        { time: '09:00', name: 'Medina of Tunis', note: 'Explore the winding alleyways', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300' },
        { time: '14:00', name: 'Sidi Bou Said', note: 'The iconic blue-and-white village', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300' },
      ],
    },
    {
      date: 'March 11',
      activities: [
        { time: '08:00', name: 'Sahara Desert Tour', note: 'Full day Sahara experience from Douz', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300' },
      ],
    },
    {
      date: 'March 12',
      activities: [
        { time: '10:00', name: 'Hammamet Beach', note: 'Relax by the Mediterranean', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
      ],
    },
  ],
})

const comments = ref([
  { id: 1, user: 'Karim T.', date: '2 days ago', text: 'Amazing itinerary! I did something similar last summer.' },
  { id: 2, user: 'Sana M.', date: '3 days ago', text: 'Adding this to my wish list 🌟' },
])

const similar = ref([
  { id: 2, title: 'Tunisia Coastal Road Trip', days: 5, author: 'karim_t', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 3, title: 'Desert & Oasis Adventure', days: 4, author: 'sana_m', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400' },
])
</script>
