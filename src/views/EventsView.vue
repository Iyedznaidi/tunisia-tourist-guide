<template>
  <v-container class="py-8">
    <!-- Page header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Local Events &amp; Experiences</h1>
        <p class="text-body-1 text-medium-emphasis mt-1">
          Connect with locals and fellow travelers through unique Tunisian experiences.
        </p>
      </div>

      <!-- Host-only: Create Event button -->
      <v-btn
        v-if="currentUser?.role === 'host'"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="createDialog = true"
      >
        Create Event
      </v-btn>
    </div>

    <!-- Filters -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="5">
        <v-text-field
          v-model="search"
          placeholder="Search events..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="lg"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="filterType"
          :items="typeOptions"
          label="Type"
          clearable
          hide-details
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filterLocation"
          :items="locationOptions"
          label="Location"
          clearable
          hide-details
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- Loading skeleton -->
    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" rounded="xl" />
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-alert v-else-if="error" type="error" rounded="xl" class="mb-4">{{ error }}</v-alert>

    <!-- Events grid -->
    <v-row v-else>
      <v-col v-for="event in filteredEvents" :key="event.id" cols="12" sm="6" md="4">
        <EventCard :event="event" />
      </v-col>
    </v-row>

    <!-- Empty state -->
    <EmptyState
      v-if="!loading && !error && filteredEvents.length === 0"
      title="No events found"
      description="Try adjusting your filters or check back soon!"
      icon="mdi-calendar-remove-outline"
    />

    <!-- Create Event dialog (host only) -->
    <CreateEventForm v-model="createDialog" @created="handleCreate" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import EventCard from '../components/EventCard.vue'
import CreateEventForm from '../components/CreateEventForm.vue'
import EmptyState from '../components/EmptyState.vue'

const { currentUser } = useAuth()
const { events, loading, error, fetchEvents, createEvent } = useEvents()

const createDialog = ref(false)
const search = ref('')
const filterType = ref(null)
const filterLocation = ref(null)

const typeOptions = ['Dinner', 'Tour', 'Cultural', 'Meetup', 'Workshop', 'Sports']

const locationOptions = computed(() => [
  ...new Set(
    events.value.map((e) =>
      e.location.includes(',') ? e.location.split(',')[0].trim() : e.location.trim(),
    ),
  ),
])

const filteredEvents = computed(() => {
  let result = events.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    )
  }
  if (filterType.value) result = result.filter((e) => e.type === filterType.value)
  if (filterLocation.value)
    result = result.filter((e) => e.location.startsWith(filterLocation.value))
  return result
})

function handleCreate(eventData) {
  createEvent(eventData, currentUser.value)
}

onMounted(fetchEvents)
</script>
