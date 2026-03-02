<template>
  <v-dialog v-model="dialog" max-width="400" rounded="xl">
    <v-card rounded="xl" class="pa-2">
      <v-card-text class="text-center pa-6">
        <v-icon icon="mdi-alert-circle-outline" color="error" size="56" class="mb-3" />
        <h3 class="text-h6 font-weight-bold mb-2">Are you sure?</h3>
        <p class="text-body-2 text-medium-emphasis">{{ message }}</p>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  message: { type: String, default: 'This action cannot be undone.' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function confirm() {
  emit('confirm')
  dialog.value = false
}
</script>
