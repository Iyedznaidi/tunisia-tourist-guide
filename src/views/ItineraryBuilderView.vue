<template>
  <v-container class="py-8">
    <div class="text-h4 font-weight-bold mb-6">Build Your Itinerary</div>

    <!-- Top form -->
    <v-card rounded="xl" class="pa-6 mb-6">
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field v-model="title" label="Itinerary Title" prepend-inner-icon="mdi-pencil-outline" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="startDate" label="Start Date" type="date" prepend-inner-icon="mdi-calendar" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="endDate" label="End Date" type="date" prepend-inner-icon="mdi-calendar-end" />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn-toggle v-model="visibility" mandatory density="compact" color="primary">
            <v-btn value="public" size="small">
              <v-icon>mdi-earth</v-icon>
            </v-btn>
            <v-btn value="private" size="small">
              <v-icon>mdi-lock</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <div class="text-caption text-medium-emphasis">
        Visibility: {{ visibility === 'public' ? 'Public' : 'Private' }}
      </div>
    </v-card>

    <v-row>
      <!-- Day-by-day timeline -->
      <v-col cols="12" md="8">
        <div v-for="(day, dayIndex) in itinerary" :key="dayIndex" class="mb-6">
          <div class="d-flex align-center mb-3">
            <v-chip color="primary" size="large" class="mr-3">
              <v-icon start>mdi-calendar</v-icon>
              Day {{ dayIndex + 1 }}
            </v-chip>
            <span class="text-body-2 text-medium-emphasis">{{ day.date || 'Set date above' }}</span>
            <v-spacer />
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              @click="addActivity(dayIndex)"
            >
              <v-icon start>mdi-plus</v-icon>Add Activity
            </v-btn>
          </div>

          <v-card rounded="xl" class="mb-2">
            <v-list>
              <v-list-item
                v-for="(act, actIndex) in day.activities"
                :key="actIndex"
                class="py-3"
              >
                <template v-slot:prepend>
                  <v-avatar color="secondary" size="36" class="mr-3">
                    <v-icon color="white" size="18">{{ act.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ act.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ act.city }} · {{ act.duration }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn icon variant="text" size="small" :disabled="actIndex === 0" @click="moveActivity(dayIndex, actIndex, -1)">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" size="small" :disabled="actIndex === day.activities.length - 1" @click="moveActivity(dayIndex, actIndex, 1)">
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" size="small" color="error" @click="removeActivity(dayIndex, actIndex)">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </template>
              </v-list-item>

              <v-list-item v-if="day.activities.length === 0">
                <v-list-item-title class="text-medium-emphasis text-center">No activities yet. Click "Add Activity".</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </div>

        <!-- Add Day -->
        <v-btn variant="dashed" color="primary" block class="mb-6" @click="addDay">
          <v-icon start>mdi-plus</v-icon>Add Day
        </v-btn>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-3">Upload Photos</div>
          <v-file-input
            v-model="photos"
            label="Add travel photos"
            multiple
            accept="image/*"
            prepend-icon="mdi-camera"
            variant="outlined"
            show-size
          />
        </v-card>

        <v-card rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Summary</div>
          <div class="text-body-2 mb-1"><v-icon size="16" class="mr-1">mdi-calendar</v-icon>{{ itinerary.length }} day{{ itinerary.length !== 1 ? 's' : '' }}</div>
          <div class="text-body-2 mb-4">
            <v-icon size="16" class="mr-1">mdi-map-marker-multiple</v-icon>
            {{ totalActivities }} activities
          </div>
          <v-btn color="primary" block size="large" @click="publish">
            <v-icon start>mdi-publish</v-icon>Publish Itinerary
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirmation -->
    <DeleteConfirmationModal v-model="deleteDialog" @confirm="confirmDelete" />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue'

const router = useRouter()
const deleteDialog = ref(false)
const photos = ref([])
const title = ref('My Tunisia Adventure')
const startDate = ref('')
const endDate = ref('')
const visibility = ref('public')

const mockActivities = [
  { name: 'Explore the Medina of Tunis', city: 'Tunis', duration: '3–4h', icon: 'mdi-bank' },
  { name: 'Sahara Desert Tour from Douz', city: 'Douz', duration: 'Full day', icon: 'mdi-terrain' },
  { name: 'Relax at Hammamet Beach', city: 'Hammamet', duration: '2–3h', icon: 'mdi-waves' },
]

const itinerary = ref([
  { date: '', activities: [mockActivities[0]] },
  { date: '', activities: [mockActivities[1], mockActivities[2]] },
])

const totalActivities = computed(() => itinerary.value.reduce((sum, d) => sum + d.activities.length, 0))

function addDay() {
  itinerary.value.push({ date: '', activities: [] })
}

function addActivity(dayIndex) {
  const pool = mockActivities
  const act = pool[Math.floor(Math.random() * pool.length)]
  itinerary.value[dayIndex].activities.push({ ...act })
}

function removeActivity(dayIndex, actIndex) {
  itinerary.value[dayIndex].activities.splice(actIndex, 1)
}

function moveActivity(dayIndex, actIndex, dir) {
  const acts = itinerary.value[dayIndex].activities
  const temp = acts[actIndex]
  acts[actIndex] = acts[actIndex + dir]
  acts[actIndex + dir] = temp
}

function publish() {
  router.push('/itineraries/1')
}
</script>
