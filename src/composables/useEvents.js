import { ref } from 'vue'
import {
  add_event,
  get_all_events,
  get_event_by_id,
  set_all_events,
  update_event_by_id,
} from '../entities/event'
import {
  add_joined_event,
  delete_joined_event_by_event_id,
  get_all_joined_events,
  get_joined_event_by_event_id,
  set_all_joined_events,
} from '../entities/joinedEvent'
import {
  add_message,
  set_all_messages,
} from '../entities/message'

// ─── LocalStorage keys ─────────────────────────────────────────────────────────
const EVENTS_KEY = 'ttg_events'
const JOINED_KEY = 'ttg_joined_events'
const MESSAGES_KEY = 'ttg_chat_messages'

// ─── Seed data (used on first load when localStorage is empty) ─────────────────
const SEED_EVENTS = [
  {
    id: 1,
    title: 'Traditional Tunisian Dinner Night',
    description:
      'Join us for an authentic home-cooked Tunisian dinner featuring couscous, brik, and lablabi. Meet locals and fellow travelers in a warm family atmosphere in the heart of the Medina.',
    type: 'Dinner',
    location: 'Medina, Tunis',
    date: '2026-04-20',
    time: '19:00',
    maxAttendees: 12,
    attendees: 7,
    price: '45 TND',
    hostId: 1,
    hostName: 'Ahmed Ben Ali',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    tags: ['Food', 'Culture', 'Indoor'],
    createdAt: '2026-03-20',
  },
  {
    id: 2,
    title: 'Sidi Bou Said Sunrise Walk',
    description:
      'Explore the stunning blue-and-white village at dawn before the crowds arrive. A guided walk through narrow alleys with breathtaking views of the Gulf of Tunis.',
    type: 'Tour',
    location: 'Sidi Bou Said, Tunis',
    date: '2026-04-23',
    time: '06:00',
    maxAttendees: 15,
    attendees: 10,
    price: '20 TND',
    hostId: 1,
    hostName: 'Ahmed Ben Ali',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600',
    tags: ['Tour', 'Culture', 'Outdoor'],
    createdAt: '2026-03-21',
  },
  {
    id: 3,
    title: 'Desert Stargazing & Campfire',
    description:
      'Spend a magical night in the Sahara under a blanket of stars. Includes a camel ride, traditional mint tea, and storytelling around the campfire.',
    type: 'Cultural',
    location: 'Douz, Sahara',
    date: '2026-04-27',
    time: '18:00',
    maxAttendees: 20,
    attendees: 14,
    price: '80 TND',
    hostId: 1,
    hostName: 'Ahmed Ben Ali',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600',
    tags: ['Desert', 'Adventure', 'Outdoor'],
    createdAt: '2026-03-22',
  },
  {
    id: 4,
    title: 'Traveler Meetup — Hammamet',
    description:
      'A casual meetup for travelers in Hammamet. Share stories, get insider tips, and make new friends at a relaxed beachside café.',
    type: 'Meetup',
    location: 'Hammamet Beach',
    date: '2026-04-30',
    time: '17:00',
    maxAttendees: 30,
    attendees: 18,
    price: 'Free',
    hostId: 1,
    hostName: 'Ahmed Ben Ali',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    tags: ['Sea', 'Social', 'Outdoor'],
    createdAt: '2026-03-23',
  },
  {
    id: 5,
    title: 'Medina Spice Market Tour',
    description:
      'Discover the aromatic world of Tunisian spices and herbs. Your local guide will teach you how to identify spices, bargain with vendors, and use them in Tunisian cuisine.',
    type: 'Cultural',
    location: 'Medina Souks, Tunis',
    date: '2026-05-03',
    time: '10:00',
    maxAttendees: 10,
    attendees: 6,
    price: '30 TND',
    hostId: 1,
    hostName: 'Ahmed Ben Ali',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
    tags: ['Culture', 'Food', 'History'],
    createdAt: '2026-03-24',
  },
]

const SEED_MESSAGES = {
  1: [
    {
      id: 1,
      eventId: 1,
      senderId: 1,
      senderName: 'Ahmed Ben Ali',
      text: 'Welcome everyone! Looking forward to our dinner together. I will be preparing couscous and brik.',
      timestamp: '2026-03-25T10:00:00Z',
    },
    {
      id: 2,
      eventId: 1,
      senderId: 99,
      senderName: 'Sarah K.',
      text: 'Cannot wait! Is there anything I should bring?',
      timestamp: '2026-03-25T10:15:00Z',
    },
    {
      id: 3,
      eventId: 1,
      senderId: 1,
      senderName: 'Ahmed Ben Ali',
      text: 'Just yourselves and your appetite! I will provide everything.',
      timestamp: '2026-03-25T10:20:00Z',
    },
  ],
  2: [
    {
      id: 1,
      eventId: 2,
      senderId: 1,
      senderName: 'Ahmed Ben Ali',
      text: 'Sunrise walk starts at 6 AM sharp. Please bring comfortable shoes and water.',
      timestamp: '2026-03-26T08:00:00Z',
    },
  ],
}

// ─── Module-level reactive state (singleton across all component instances) ─────
const events = ref([])
const joinedEventIds = ref([]) // Array<Number>
const chatMessages = ref({})   // { [eventId]: Message[] }
const loading = ref(false)
const error = ref('')

// ─── Storage helpers ───────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const storedEvents = localStorage.getItem(EVENTS_KEY)
    if (storedEvents) {
      set_all_events(JSON.parse(storedEvents))
      events.value = [...get_all_events()]
    } else {
      set_all_events(SEED_EVENTS)
      events.value = [...get_all_events()]
      localStorage.setItem(EVENTS_KEY, JSON.stringify(get_all_events()))
    }

    const storedJoined = localStorage.getItem(JOINED_KEY)
    set_all_joined_events(storedJoined ? JSON.parse(storedJoined) : [])
    joinedEventIds.value = get_all_joined_events().map((joinedEvent) => joinedEvent.eventId)

    const storedMessages = localStorage.getItem(MESSAGES_KEY)
    if (storedMessages) {
      // localStorage keys are strings; convert them to numbers for consistency
      const parsed = JSON.parse(storedMessages)
      const messages = Object.values(parsed).flat()
      set_all_messages(messages)
      chatMessages.value = Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [Number(k), v]),
      )
    } else {
      chatMessages.value = { ...SEED_MESSAGES }
      const messages = Object.values(SEED_MESSAGES).flat()
      set_all_messages(messages)
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(chatMessages.value))
    }
  } catch {
    set_all_events(SEED_EVENTS)
    events.value = [...get_all_events()]
    chatMessages.value = { ...SEED_MESSAGES }
    set_all_messages(Object.values(SEED_MESSAGES).flat())
  }
}

function saveEvents() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(get_all_events()))
}

function saveJoined() {
  localStorage.setItem(JOINED_KEY, JSON.stringify(joinedEventIds.value))
}

function saveMessages() {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(chatMessages.value))
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useEvents() {
  /**
   * Simulate fetching events from GET /api/events.
   * Loads from localStorage (seeding with mock data on first run).
   */
  async function fetchEvents() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500))
      loadFromStorage()
    } catch {
      error.value = 'Failed to load events. Please try again.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Ensure a chat room entry exists for a given event.
   */
  function ensureChatExists(id) {
    if (!chatMessages.value[id]) {
      chatMessages.value = { ...chatMessages.value, [id]: [] }
    }
  }

  /**
   * Simulate POST /api/events.
   * Creates a new event and persists it to localStorage.
   */
function createEvent(eventData, currentUser) {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      tags: eventData.tags?.length ? eventData.tags : [eventData.type],
      hostId: currentUser.id,
      hostName: currentUser.fullName,
      attendees: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    set_all_events([newEvent, ...get_all_events()])
    events.value = [...get_all_events()]
    chatMessages.value = { ...chatMessages.value, [newEvent.id]: [] }
    saveEvents()
    saveMessages()
    return newEvent
  }

  /**
   * Simulate POST /api/events/:eventId/join.
   */
function joinEvent(eventId) {
    const id = Number(eventId)
    if (get_joined_event_by_event_id(id)) return
    add_joined_event(id)
    joinedEventIds.value = get_all_joined_events().map((joinedEvent) => joinedEvent.eventId)

    const event = get_event_by_id(id)
    if (event) {
      update_event_by_id(id, { attendees: event.attendees + 1 })
      events.value = [...get_all_events()]
    }

    ensureChatExists(id)

    saveJoined()
    saveEvents()
  }

  /**
   * Remove the current user from an event.
   */
function leaveEvent(eventId) {
    const id = Number(eventId)
    delete_joined_event_by_event_id(id)
    joinedEventIds.value = get_all_joined_events().map((joinedEvent) => joinedEvent.eventId)

    const event = get_event_by_id(id)
    if (event) {
      update_event_by_id(id, { attendees: Math.max(0, event.attendees - 1) })
      events.value = [...get_all_events()]
    }

    saveJoined()
    saveEvents()
  }

  /** Check whether the current user has joined a given event. */
function isJoined(eventId) {
    return !!get_joined_event_by_event_id(eventId)
}

  /**
   * Simulate GET /api/events/:eventId/messages.
   * Ensures a messages array exists for the event.
   */
  async function fetchMessages(eventId) {
    const id = Number(eventId)
    ensureChatExists(id)
  }

  /**
   * Add a message to an event's chat room.
   */
function sendMessage(eventId, currentUser, text) {
    if (!text.trim()) return
    const id = Number(eventId)
    const message = {
      id: Date.now(),
      eventId: id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    }
    add_message(message)
    const existing = chatMessages.value[id] || []
    chatMessages.value = { ...chatMessages.value, [id]: [...existing, message] }
    saveMessages()
    return message
  }

function getEventById(id) {
    return get_event_by_id(id)
}

  function getMessages(eventId) {
    return chatMessages.value[Number(eventId)] || []
  }

  return {
    // state
    events,
    joinedEventIds,
    chatMessages,
    loading,
    error,
    // methods
    fetchEvents,
    createEvent,
    joinEvent,
    leaveEvent,
    isJoined,
    fetchMessages,
    sendMessage,
    getEventById,
    getMessages,
  }
}
