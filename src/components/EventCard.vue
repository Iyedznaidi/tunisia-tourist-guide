<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 8 : 2"
      rounded="xl"
      height="100%"
      style="transition: box-shadow 0.2s; cursor: pointer"
      :to="`/events/${event.id}`"
    >
      <v-img :src="event.image" height="160" cover>
        <div class="d-flex justify-space-between pa-2">
          <v-chip :color="typeColor(event.type)" size="small" variant="elevated">
            {{ event.type }}
          </v-chip>
          <v-chip size="small" variant="elevated" color="surface">
            {{ event.price }}
          </v-chip>
        </div>
      </v-img>

      <v-card-title class="pb-1 text-body-1 font-weight-bold">{{ event.title }}</v-card-title>

      <v-card-text class="pt-1">
        <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
          <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
          {{ event.location }}
        </div>
        <div class="d-flex align-center text-caption text-medium-emphasis mb-2">
          <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
          {{ formatDate(event.date) }} · {{ event.time }}
        </div>
        <div class="d-flex flex-wrap ga-1 mb-2">
          <v-chip
            v-for="tag in event.tags"
            :key="tag"
            size="x-small"
            color="primary"
            variant="tonal"
          >{{ tag }}</v-chip>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="text-caption text-medium-emphasis">
            <v-icon size="14" class="mr-1">mdi-account-group</v-icon>
            {{ event.attendees }} / {{ event.maxAttendees }} joined
          </div>
          <span class="text-caption text-medium-emphasis">by {{ event.hostName }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script setup>
defineProps({
  event: { type: Object, required: true },
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function typeColor(type) {
  const map = { Dinner: 'warning', Tour: 'info', Cultural: 'success', Meetup: 'secondary' }
  return map[type] || 'primary'
}
</script>
