<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center text-h6 pa-5 pb-3">
        <v-icon start color="primary">mdi-calendar-plus</v-icon>
        Create a New Event
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <v-text-field
          v-model="form.title"
          label="Event Title"
          prepend-inner-icon="mdi-format-title"
          variant="outlined"
          class="mb-3"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          prepend-inner-icon="mdi-text"
          variant="outlined"
          rows="3"
          class="mb-3"
        />
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.type"
              :items="eventTypes"
              label="Event Type"
              prepend-inner-icon="mdi-tag-outline"
              variant="outlined"
              class="mb-3"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.price"
              label="Price (e.g. 25 TND or Free)"
              prepend-inner-icon="mdi-cash"
              variant="outlined"
              class="mb-3"
            />
          </v-col>
        </v-row>

        <v-text-field
          v-model="form.location"
          label="Location"
          prepend-inner-icon="mdi-map-marker"
          variant="outlined"
          class="mb-3"
        />

        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.date"
              label="Date"
              type="date"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              class="mb-3"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.time"
              label="Time"
              type="time"
              prepend-inner-icon="mdi-clock-outline"
              variant="outlined"
              class="mb-3"
            />
          </v-col>
        </v-row>

        <v-text-field
          v-model.number="form.maxAttendees"
          label="Max Attendees"
          type="number"
          prepend-inner-icon="mdi-account-group"
          variant="outlined"
          min="1"
          class="mb-3"
        />

        <v-text-field
          v-model="form.image"
          label="Image URL (optional)"
          prepend-inner-icon="mdi-image"
          variant="outlined"
        />
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" variant="elevated" :disabled="!isValid" @click="submit">
          Create Event
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'created'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const eventTypes = ['Dinner', 'Tour', 'Cultural', 'Meetup', 'Workshop', 'Sports']

const defaultForm = () => ({
  title: '',
  description: '',
  type: 'Cultural',
  location: '',
  date: '',
  time: '',
  maxAttendees: 10,
  price: 'Free',
  image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
  tags: [],
})

const form = ref(defaultForm())

const isValid = computed(
  () =>
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.location.trim() &&
    form.value.date &&
    form.value.time,
)

function submit() {
  emit('created', {
    ...form.value,
    tags: form.value.tags.length ? form.value.tags : [form.value.type],
  })
  dialog.value = false
  form.value = defaultForm()
}
</script>
