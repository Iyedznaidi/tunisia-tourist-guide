<template>
  <div class="d-flex flex-column align-center justify-center text-center py-12">
    <v-icon :icon="icon" color="primary" size="72" style="opacity:.5" class="mb-4" />
    <div class="text-h6 font-weight-bold mb-2">{{ title }}</div>
    <p class="text-body-2 text-medium-emphasis mb-4">{{ description }}</p>
    <v-btn v-if="action" color="primary" variant="tonal" @click="$emit('action')">
      {{ action }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-folder-open-outline' },
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: '' },
  action: { type: String, default: '' },
})
defineEmits(['action'])
</script>
