<template>
  <v-dialog v-model="dialog" max-width="500" rounded="xl">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="text-h6 pa-4">Write a Review</v-card-title>
      <v-card-text>
        <div class="text-body-2 font-weight-medium mb-1">Your Rating</div>
        <v-rating v-model="rating" color="amber" hover size="32" class="mb-4" />

        <v-textarea
          v-model="reviewText"
          label="Share your experience..."
          variant="outlined"
          rows="4"
          class="mb-3"
        />

        <v-file-input
          v-model="photos"
          label="Add photos (optional)"
          accept="image/*"
          multiple
          prepend-icon="mdi-camera"
          variant="outlined"
          show-size
        />
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="submit">Submit Review</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const rating = ref(5)
const reviewText = ref('')
const photos = ref([])

function submit() {
  // Mock submit
  dialog.value = false
}
</script>
