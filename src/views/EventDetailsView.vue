<template>
  <!-- Event found -->
  <div v-if="event">
    <!-- Hero image -->
    <v-img :src="event.image" height="340" cover>
      <div
        class="fill-height"
        style="background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))"
      >
        <v-container class="fill-height d-flex flex-column justify-end pb-6">
          <div class="d-flex flex-wrap ga-2 mb-2">
            <v-chip :color="typeColor(event.type)" size="small">{{ event.type }}</v-chip>
            <v-chip
              v-for="tag in event.tags"
              :key="tag"
              size="small"
              color="primary"
              variant="outlined"
            >{{ tag }}</v-chip>
          </div>
          <h1 class="text-h4 font-weight-bold text-white">{{ event.title }}</h1>
          <p class="text-subtitle-1 text-white" style="opacity: 0.85">
            hosted by {{ event.hostName }}
          </p>
        </v-container>
      </div>
    </v-img>

    <v-container class="py-8">
      <v-row>
        <!-- ── Main column ─────────────────────────────────────────── -->
        <v-col cols="12" md="8">
          <!-- Quick-info row -->
          <v-card rounded="xl" class="pa-5 mb-6">
            <v-row align="center">
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-map-marker</v-icon>
                <div class="text-caption">Location</div>
                <div class="text-body-2 font-weight-bold">{{ event.location }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-calendar</v-icon>
                <div class="text-caption">Date</div>
                <div class="text-body-2 font-weight-bold">{{ formatDate(event.date) }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-clock-outline</v-icon>
                <div class="text-caption">Time</div>
                <div class="text-body-2 font-weight-bold">{{ event.time }}</div>
              </v-col>
              <v-col cols="6" sm="3" class="text-center">
                <v-icon color="primary">mdi-account-group</v-icon>
                <div class="text-caption">Attendees</div>
                <div class="text-body-2 font-weight-bold">
                  {{ event.attendees }} / {{ event.maxAttendees }}
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Description -->
          <div class="text-h6 font-weight-bold mb-2">About this Experience</div>
          <p class="text-body-1 text-medium-emphasis mb-6">{{ event.description }}</p>

          <!-- Event Chat — visible only to joined users -->
          <template v-if="hasJoined">
            <div class="text-h6 font-weight-bold mb-4">
              <v-icon color="primary" class="mr-1">mdi-chat-outline</v-icon>
              Event Chat
            </div>
            <EventChat
              :messages="eventMessages"
              :current-user="currentUser"
              @send="(text) => handleSend(text)"
            />
          </template>

          <v-alert
            v-else
            type="info"
            variant="tonal"
            rounded="xl"
            icon="mdi-lock-outline"
            class="mt-4"
          >
            Join this event to access the group chat room.
          </v-alert>
        </v-col>

        <!-- ── Sidebar ─────────────────────────────────────────────── -->
        <v-col cols="12" md="4">
          <!-- Booking card -->
          <v-card rounded="xl" class="pa-5 mb-4" elevation="3">
            <div class="text-h5 font-weight-bold text-primary mb-1">{{ event.price }}</div>
            <div class="text-caption text-medium-emphasis mb-4">per person</div>

            <v-progress-linear
              :model-value="(event.attendees / event.maxAttendees) * 100"
              color="primary"
              height="6"
              rounded
              class="mb-2"
            />
            <div class="text-caption text-medium-emphasis mb-5">
              {{ event.maxAttendees - event.attendees }} spots remaining
            </div>

            <JoinEventButton
              :joined="hasJoined"
              :event-id="event.id"
              @join="joinEvent"
              @leave="leaveEvent"
            />
          </v-card>

          <!-- Host card -->
          <v-card rounded="xl" class="pa-4">
            <div class="text-subtitle-2 font-weight-bold mb-3">Hosted by</div>
            <div class="d-flex align-center">
              <v-avatar color="secondary" size="44" class="mr-3">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-bold">{{ event.hostName }}</div>
                <div class="text-caption text-medium-emphasis">Local Host</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Loading / not-found fallback -->
  <v-container v-else class="py-8">
    <v-row v-if="loading">
      <v-col cols="12" md="8">
        <v-skeleton-loader type="article" rounded="xl" />
      </v-col>
    </v-row>
    <EmptyState
      v-else
      title="Event not found"
      description="This event may have been removed or does not exist."
      icon="mdi-calendar-remove-outline"
    />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useEvents } from '../composables/useEvents'
import EventChat from '../components/EventChat.vue'
import JoinEventButton from '../components/JoinEventButton.vue'
import EmptyState from '../components/EmptyState.vue'

const route = useRoute()
const { currentUser } = useAuth()
const { loading, fetchEvents, joinEvent, leaveEvent, isJoined, sendMessage, getEventById, getMessages } =
  useEvents()

const eventId = computed(() => Number(route.params.id))
const event = computed(() => getEventById(eventId.value))
const hasJoined = computed(() => isJoined(eventId.value))
const eventMessages = computed(() => getMessages(eventId.value))

function handleSend(text) {
  sendMessage(eventId.value, currentUser.value, text)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function typeColor(type) {
  const map = { Dinner: 'warning', Tour: 'info', Cultural: 'success', Meetup: 'secondary' }
  return map[type] || 'primary'
}

onMounted(fetchEvents)
</script>
