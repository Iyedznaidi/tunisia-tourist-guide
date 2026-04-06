<template>
  <v-card rounded="xl" elevation="2">
    <v-card-title class="d-flex align-center pa-4 pb-3">
      <v-icon color="primary" class="mr-2">mdi-chat-outline</v-icon>
      Event Chat
    </v-card-title>
    <v-divider />

    <!-- Messages list -->
    <div ref="messagesEl" class="event-chat__messages pa-4">
      <div v-if="messages.length === 0" class="text-center text-medium-emphasis py-8">
        <v-icon size="48" color="grey-lighten-1">mdi-chat-sleep-outline</v-icon>
        <p class="text-body-2 mt-2">No messages yet. Start the conversation!</p>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="event-chat__bubble-wrapper"
        :class="{ 'event-chat__bubble-wrapper--own': msg.senderId === currentUser?.id }"
      >
        <div
          class="event-chat__bubble"
          :class="
            msg.senderId === currentUser?.id
              ? 'event-chat__bubble--own'
              : 'event-chat__bubble--other'
          "
        >
          <span class="event-chat__sender">{{ msg.senderName }}</span>
          <p class="event-chat__text">{{ msg.text }}</p>
          <span class="event-chat__time">{{ formatTime(msg.timestamp) }}</span>
        </div>
      </div>
    </div>

    <v-divider />

    <!-- Input row -->
    <div class="d-flex align-center ga-2 pa-3">
      <v-text-field
        v-model="newMessage"
        placeholder="Type a message..."
        variant="outlined"
        density="compact"
        hide-details
        rounded="lg"
        @keyup.enter="send"
      />
      <v-btn icon color="primary" :disabled="!newMessage.trim()" @click="send">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: { type: Array, required: true },
  currentUser: { type: Object, required: true },
})

const emit = defineEmits(['send'])

const newMessage = ref('')
const messagesEl = ref(null)

function send() {
  if (!newMessage.value.trim()) return
  emit('send', newMessage.value.trim())
  newMessage.value = ''
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Auto-scroll to the latest message whenever the list grows
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  },
)
</script>

<style scoped>
.event-chat__messages {
  height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-chat__bubble-wrapper {
  display: flex;
}

.event-chat__bubble-wrapper--own {
  justify-content: flex-end;
}

.event-chat__bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 16px;
}

.event-chat__bubble--other {
  background-color: #f0f0f0;
  border-bottom-left-radius: 4px;
}

.event-chat__bubble--own {
  background-color: #e07a2f;
  color: white;
  border-bottom-right-radius: 4px;
}

.event-chat__sender {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 2px;
  opacity: 0.8;
}

.event-chat__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.event-chat__time {
  display: block;
  font-size: 0.65rem;
  opacity: 0.65;
  text-align: right;
  margin-top: 2px;
}
</style>
