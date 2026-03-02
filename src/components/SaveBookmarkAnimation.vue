<template>
  <v-btn
    icon
    :color="saved ? 'primary' : 'default'"
    variant="text"
    @click="toggle"
  >
    <v-scale-transition>
      <v-icon :key="saved ? 'saved' : 'unsaved'">
        {{ saved ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
      </v-icon>
    </v-scale-transition>
  </v-btn>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const saved = ref(props.modelValue)

function toggle() {
  saved.value = !saved.value
  emit('update:modelValue', saved.value)
}
</script>
