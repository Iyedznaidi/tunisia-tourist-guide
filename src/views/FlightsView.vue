<template>
  <v-container class="py-8">
    <div class="text-h4 font-weight-bold mb-6">Find Flights to Tunisia</div>

    <!-- Search Form -->
    <v-card rounded="xl" class="pa-6 mb-8" elevation="2">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="origin" label="From" prepend-inner-icon="mdi-airplane-takeoff" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select v-model="destination" :items="destinations" label="To (Tunisia)" prepend-inner-icon="mdi-airplane-landing" />
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="departDate" label="Departure" type="date" prepend-inner-icon="mdi-calendar" />
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="returnDate" label="Return" type="date" prepend-inner-icon="mdi-calendar-end" />
        </v-col>
        <v-col cols="6" md="1">
          <v-text-field v-model="travelers" label="Travelers" type="number" min="1" max="10" />
        </v-col>
        <v-col cols="6" md="1">
          <v-select v-model="cabin" :items="cabinClasses" label="Class" />
        </v-col>
      </v-row>
      <div class="d-flex justify-end">
        <v-btn color="primary" size="large" @click="searchFlights">
          <v-icon start>mdi-magnify</v-icon>Search Flights
        </v-btn>
      </div>
    </v-card>

    <!-- Results -->
    <v-row v-if="searched">
      <!-- Sidebar Filters -->
      <v-col cols="12" md="3">
        <v-card rounded="xl" class="pa-4" elevation="1">
          <div class="text-subtitle-1 font-weight-bold mb-3">Filters</div>

          <div class="text-body-2 font-weight-medium mb-2">Price Range</div>
          <v-range-slider
            v-model="priceRange"
            :min="50" :max="2000"
            step="50"
            color="primary"
            thumb-label
            class="mb-2"
          />
          <div class="d-flex justify-space-between text-caption mb-4">
            <span>€{{ priceRange[0] }}</span>
            <span>€{{ priceRange[1] }}</span>
          </div>

          <div class="text-body-2 font-weight-medium mb-2">Duration</div>
          <v-range-slider
            v-model="durationRange"
            :min="1" :max="24"
            step="1"
            color="primary"
            thumb-label
            class="mb-4"
          />

          <div class="text-body-2 font-weight-medium mb-2">Stops</div>
          <v-chip-group v-model="selectedStops" multiple column>
            <v-chip filter color="primary" size="small">Non-stop</v-chip>
            <v-chip filter color="primary" size="small">1 Stop</v-chip>
            <v-chip filter color="primary" size="small">2+ Stops</v-chip>
          </v-chip-group>
        </v-card>
      </v-col>

      <!-- Flight Results -->
      <v-col cols="12" md="9">
        <div class="text-h6 mb-4">{{ flights.length }} flights found</div>

        <v-card
          v-for="flight in flights"
          :key="flight.id"
          rounded="xl"
          class="mb-4 pa-4"
          hover
        >
          <v-row align="center">
            <v-col cols="12" sm="3">
              <div class="font-weight-bold text-h6">{{ flight.airline }}</div>
              <div class="text-caption text-medium-emphasis">{{ flight.flightNo }}</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <div class="d-flex align-center justify-center ga-2">
                <div>
                  <div class="text-h6 font-weight-bold">{{ flight.departTime }}</div>
                  <div class="text-caption text-medium-emphasis">{{ flight.origin }}</div>
                </div>
                <div class="text-center">
                  <div class="text-caption text-medium-emphasis">{{ flight.duration }}</div>
                  <div class="d-flex align-center">
                    <v-divider style="flex:1" />
                    <v-icon size="16" color="primary">mdi-airplane</v-icon>
                    <v-divider style="flex:1" />
                  </div>
                  <div class="text-caption text-medium-emphasis">{{ flight.stops }}</div>
                </div>
                <div>
                  <div class="text-h6 font-weight-bold">{{ flight.arriveTime }}</div>
                  <div class="text-caption text-medium-emphasis">{{ flight.destination }}</div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="3" class="text-center">
              <div class="text-h5 font-weight-bold text-primary">€{{ flight.price }}</div>
              <div class="text-caption text-medium-emphasis">per person</div>
            </v-col>
            <v-col cols="12" sm="2" class="text-center">
              <v-btn color="primary" block>Select</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty state before searching -->
    <EmptyState
      v-if="!searched"
      title="Search for flights"
      description="Enter your origin and dates to find the best flights to Tunisia"
      icon="mdi-airplane-search"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'

const origin = ref('')
const destination = ref('Tunis (TUN)')
const departDate = ref('')
const returnDate = ref('')
const travelers = ref(1)
const cabin = ref('Economy')
const searched = ref(false)
const priceRange = ref([50, 1000])
const durationRange = ref([1, 12])
const selectedStops = ref([])

const destinations = ['Tunis (TUN)', 'Djerba (DJE)', 'Monastir (MIR)', 'Sfax (SFA)', 'Tozeur (TOE)']
const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First Class']

function searchFlights() {
  searched.value = true
}

const flights = ref([
  { id: 1, airline: 'Tunisair', flightNo: 'TU 751', departTime: '08:30', arriveTime: '11:45', origin: 'CDG', destination: 'TUN', duration: '3h 15m', stops: 'Non-stop', price: 189 },
  { id: 2, airline: 'Air France', flightNo: 'AF 1530', departTime: '10:20', arriveTime: '14:05', origin: 'CDG', destination: 'TUN', duration: '3h 45m', stops: 'Non-stop', price: 245 },
  { id: 3, airline: 'Nouvelair', flightNo: 'BJ 410', departTime: '14:15', arriveTime: '17:30', origin: 'ORY', destination: 'DJE', duration: '3h 15m', stops: 'Non-stop', price: 167 },
  { id: 4, airline: 'Transavia', flightNo: 'TO 3415', departTime: '06:45', arriveTime: '12:30', origin: 'CDG', destination: 'TUN', duration: '5h 45m', stops: '1 Stop', price: 128 },
  { id: 5, airline: 'Ryanair', flightNo: 'FR 5522', departTime: '19:00', arriveTime: '23:45', origin: 'BRU', destination: 'TUN', duration: '4h 45m', stops: 'Non-stop', price: 98 },
])
</script>
