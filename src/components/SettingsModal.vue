<template>
  <v-dialog v-model="dialog" max-width="440" rounded="xl">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="text-h6 pa-4">Settings</v-card-title>
      <v-card-text>
        <div class="text-body-2 font-weight-medium mb-2">Language</div>
        <v-select v-model="language" :items="languages" variant="outlined" density="comfortable" class="mb-4" />

        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-body-2 font-weight-medium">Dark Mode</div>
            <div class="text-caption text-medium-emphasis">Toggle dark/light theme</div>
          </div>
          <v-switch v-model="darkMode" color="primary" hide-details inset @update:modelValue="toggleTheme" />
        </div>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'update:theme'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const language = ref('English')
const languages = ['English', 'Arabic', 'French']
const darkMode = ref(false)

function toggleTheme(val) {
  emit('update:theme', val ? 'dark' : 'tunisiaTheme')
}

function save() {
  dialog.value = false
}
</script>
