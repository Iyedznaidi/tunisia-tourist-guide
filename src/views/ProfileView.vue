<template>
  <v-container class="py-8">
    <!-- Profile Header -->
    <v-card rounded="xl" class="pa-6 mb-6" elevation="2">
      <div class="d-flex align-start flex-wrap ga-4">
        <v-avatar color="secondary" size="96">
          <v-icon color="white" size="48">mdi-account</v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold">{{ profile.name }}</div>
          <div class="text-body-2 text-medium-emphasis mb-1">@{{ profile.username }}</div>
          <div class="text-body-2 text-medium-emphasis mb-3">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>{{ profile.location }}
          </div>
          <p class="text-body-2 mb-3">{{ profile.bio }}</p>
          <div class="d-flex flex-wrap ga-2">
            <v-chip v-for="tag in profile.interests" :key="tag" size="small" color="primary" variant="tonal">{{ tag }}</v-chip>
          </div>
        </div>
        <div class="d-flex flex-column ga-2">
          <!-- Own profile: show Edit + Logout; other profiles: show Follow -->
          <template v-if="isOwnProfile">
            <v-btn color="primary" variant="outlined" @click="openEditDialog">
              <v-icon start>mdi-pencil-outline</v-icon>Edit Profile
            </v-btn>
            <v-btn color="error" variant="text" @click="logout">
              <v-icon start>mdi-logout</v-icon>Log out
            </v-btn>
          </template>
          <template v-else>
            <v-btn color="primary" variant="outlined">
              <v-icon start>mdi-account-plus</v-icon>Follow
            </v-btn>
          </template>
        </div>
      </div>

      <!-- Stats -->
      <v-row class="mt-4" align="center" justify="space-around">
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ profile.stats.itineraries }}</div>
          <div class="text-caption text-medium-emphasis">Itineraries</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ profile.stats.followers }}</div>
          <div class="text-caption text-medium-emphasis">Followers</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ profile.stats.following }}</div>
          <div class="text-caption text-medium-emphasis">Following</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ profile.stats.reviews }}</div>
          <div class="text-caption text-medium-emphasis">Reviews</div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tabs -->
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="itineraries"><v-icon start>mdi-map</v-icon>Itineraries</v-tab>
      <v-tab value="photos"><v-icon start>mdi-image-multiple</v-icon>Photos</v-tab>
      <v-tab value="reviews"><v-icon start>mdi-star</v-icon>Reviews</v-tab>
      <v-tab value="saved"><v-icon start>mdi-bookmark</v-icon>Saved</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Itineraries -->
      <v-window-item value="itineraries">
        <v-row>
          <v-col v-for="it in itineraries" :key="it.id" cols="12" sm="6" md="4">
            <v-card rounded="xl" :to="`/itineraries/${it.id}`">
              <v-img :src="it.image" height="150" cover />
              <v-card-title class="text-body-1">{{ it.title }}</v-card-title>
              <v-card-subtitle>{{ it.days }} days · {{ it.views }} views</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <EmptyState v-if="itineraries.length === 0" title="No itineraries yet" description="Start planning your first trip!" icon="mdi-map-plus" />
      </v-window-item>

      <!-- Photos -->
      <v-window-item value="photos">
        <v-row>
          <v-col v-for="(photo, i) in photos" :key="i" cols="6" sm="4" md="3">
            <v-img :src="photo" height="160" cover rounded="lg" class="cursor-pointer" />
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Reviews -->
      <v-window-item value="reviews">
        <v-card v-for="rev in userReviews" :key="rev.id" rounded="xl" class="mb-3 pa-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
            <span class="text-subtitle-2 font-weight-bold">{{ rev.place }}</span>
            <v-spacer />
            <v-rating :model-value="rev.rating" density="compact" size="small" color="amber" readonly />
          </div>
          <p class="text-body-2">{{ rev.text }}</p>
          <div class="text-caption text-medium-emphasis mt-1">{{ rev.date }}</div>
        </v-card>
      </v-window-item>

      <!-- Saved -->
      <v-window-item value="saved">
        <v-row>
          <v-col v-for="saved in savedItems" :key="saved.id" cols="12" sm="6" md="4">
            <v-card rounded="xl" :to="`/activity/${saved.id}`">
              <v-img :src="saved.image" height="140" cover />
              <v-card-title class="text-body-1">{{ saved.name }}</v-card-title>
              <v-card-subtitle>{{ saved.city }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <EmptyState v-if="savedItems.length === 0" title="Nothing saved yet" description="Bookmark activities to see them here" icon="mdi-bookmark-plus-outline" />
      </v-window-item>
    </v-window>

    <!-- Edit Profile Dialog (only for own profile) -->
    <v-dialog v-if="isOwnProfile" v-model="editDialog" max-width="500" persistent>
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">Edit Profile</v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.fullName" label="Full Name" prepend-inner-icon="mdi-account-outline" class="mb-3" />
          <v-text-field v-model="editForm.location" label="Location" prepend-inner-icon="mdi-map-marker-outline" class="mb-3" />
          <v-textarea v-model="editForm.bio" label="Bio" prepend-inner-icon="mdi-text-box-outline" rows="3" class="mb-1" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveProfile">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { isAuthenticated, currentUser, logout, updateProfile } = useAuth()
const tab = ref('itineraries')

// Determine if we are viewing our own profile
const isOwnProfile = computed(() => {
  if (!isAuthenticated.value || !currentUser.value) return false
  const param = route.params.username
  return param === 'me' || param === currentUser.value.username
})

// Build profile from auth state when viewing own profile, otherwise use mock data
const profile = computed(() => {
  if (isOwnProfile.value && currentUser.value) {
    return {
      name: currentUser.value.fullName || currentUser.value.username,
      username: currentUser.value.username,
      location: currentUser.value.location || '',
      bio: currentUser.value.bio || '',
      interests: currentUser.value.interests || [],
      stats: { itineraries: 0, followers: 0, following: 0, reviews: 0 },
    }
  }
  // Fallback mock profile for other users
  return {
    name: 'Amira Ben Ali',
    username: route.params.username || 'amira_b',
    location: 'Tunis, Tunisia',
    bio: 'Passionate traveller exploring the hidden gems of Tunisia. Culture, food & desert lover 🏜️',
    interests: ['Desert', 'Culture', 'Food', 'Hiking', 'History'],
    stats: { itineraries: 12, followers: 840, following: 320, reviews: 45 },
  }
})

// Edit profile form
const editDialog = ref(false)
const editForm = ref({ fullName: '', location: '', bio: '' })

function openEditDialog() {
  editForm.value = {
    fullName: currentUser.value?.fullName || '',
    location: currentUser.value?.location || '',
    bio: currentUser.value?.bio || '',
  }
  editDialog.value = true
}

function saveProfile() {
  updateProfile({
    fullName: editForm.value.fullName,
    location: editForm.value.location,
    bio: editForm.value.bio,
  })
  editDialog.value = false
}

const itineraries = ref([
  { id: 1, title: 'Best of Tunisia in 7 Days', days: 7, views: 1240, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400' },
  { id: 2, title: 'Coastal Road Trip', days: 5, views: 860, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 3, title: 'Sahara Weekend', days: 3, views: 620, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400' },
])

const photos = ref([
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300',
])

const userReviews = ref([
  { id: 1, place: 'Medina of Tunis', rating: 5, text: 'Absolutely magical. The souks are full of life!', date: 'Feb 2024' },
  { id: 2, place: 'Sahara Desert Tour', rating: 5, text: 'Life-changing experience under the stars.', date: 'Jan 2024' },
])

const savedItems = ref([
  { id: 4, name: 'El Jem Amphitheatre', city: 'El Jem', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300' },
  { id: 6, name: 'Djerba Island', city: 'Djerba', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=300' },
])
</script>
