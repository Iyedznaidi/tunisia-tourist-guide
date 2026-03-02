<template>
  <v-row>
    <v-col v-for="i in count" :key="i" :cols="cols">
      <v-skeleton-loader
        :type="type"
        rounded="xl"
      />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 6 },
  cols: { type: [Number, String], default: 4 },
  type: { type: String, default: 'card' },
})
</script>
