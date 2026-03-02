<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card color="black" style="position:relative" flat>
      <!-- Close -->
      <v-btn
        icon
        color="white"
        variant="text"
        size="large"
        style="position:absolute;top:16px;right:16px;z-index:10"
        @click="dialog = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- Left arrow -->
      <v-btn
        icon
        color="white"
        variant="text"
        size="x-large"
        style="position:absolute;left:16px;top:50%;transform:translateY(-50%);z-index:10"
        :disabled="current === 0"
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- Image -->
      <v-img
        :src="photos[current]"
        max-height="100vh"
        contain
        style="height:100vh"
      />

      <!-- Right arrow -->
      <v-btn
        icon
        color="white"
        variant="text"
        size="x-large"
        style="position:absolute;right:16px;top:50%;transform:translateY(-50%);z-index:10"
        :disabled="current === photos.length - 1"
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <!-- Counter -->
      <div
        class="text-white text-caption"
        style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%)"
      >
        {{ current + 1 }} / {{ photos.length }}
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  photos: { type: Array, default: () => [] },
  initialIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const current = ref(props.initialIndex)
watch(() => props.initialIndex, (v) => { current.value = v })
watch(() => props.modelValue, (v) => { if (v) current.value = props.initialIndex })

function prev() { if (current.value > 0) current.value-- }
function next() { if (current.value < props.photos.length - 1) current.value++ }
</script>
