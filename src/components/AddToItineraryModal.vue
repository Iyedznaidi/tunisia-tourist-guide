<template>
  <v-dialog v-model="dialog" max-width="440" rounded="xl">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="text-h6 pa-4">Add to Itinerary</v-card-title>
      <v-card-text>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Adding: <strong>{{ activity?.name }}</strong>
        </div>
        <v-select
          v-model="selectedItinerary"
          :items="itineraries"
          label="Select Itinerary"
          item-title="title"
          item-value="id"
          class="mb-3"
        />
        <v-btn variant="text" color="primary" size="small" to="/itineraries/create">
          <v-icon start>mdi-plus</v-icon>New Itinerary
        </v-btn>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="add">Add Activity</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  activity: Object,
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const selectedItinerary = ref(null)
const itineraries = ref([
  { id: 1, title: 'Best of Tunisia in 7 Days' },
  { id: 2, title: 'Coastal Road Trip' },
  { id: 3, title: 'Sahara Weekend' },
])

function add() {
  dialog.value = false
}
</script>
