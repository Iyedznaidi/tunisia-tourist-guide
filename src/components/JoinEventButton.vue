<template>
  <v-btn
    :color="joined ? 'error' : 'primary'"
    :variant="joined ? 'outlined' : 'elevated'"
    size="large"
    block
    @click="toggle"
  >
    <v-icon start>{{ joined ? 'mdi-exit-run' : 'mdi-account-plus' }}</v-icon>
    {{ joined ? 'Leave Event' : 'Join Event' }}
  </v-btn>
</template>

<script setup>
const props = defineProps({
  joined: { type: Boolean, required: true },
  eventId: { type: [Number, String], required: true },
})

const emit = defineEmits(['join', 'leave'])

function toggle() {
  if (props.joined) {
    emit('leave', props.eventId)
  } else {
    emit('join', props.eventId)
  }
}
</script>
