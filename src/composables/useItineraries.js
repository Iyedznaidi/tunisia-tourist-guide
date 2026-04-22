import { ref } from 'vue'
import {
  Itinerary,
  get_all_itineraries,
  get_itinerary_by_id,
  get_itineraries_by_author_id,
  set_all_itineraries,
  add_itinerary,
  update_itinerary_by_id,
  delete_itinerary_by_id,
} from '../entities/itinerary'

// ─── LocalStorage key ──────────────────────────────────────────────────────────
const ITINERARIES_KEY = 'ttg_itineraries'

// ─── Seed data (demo user authorId = 1) ────────────────────────────────────────
const SEED_ITINERARIES = [
  {
    id: 1,
    title: 'Best of Tunisia in 7 Days',
    startDate: 'March 10, 2024',
    endDate: 'March 17, 2024',
    visibility: 'public',
    authorId: 1,
    authorName: 'Ahmed Ben Ali',
    authorUsername: 'ahmed_adventures',
    photos: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
    ],
    days: [
      {
        date: 'March 10',
        activities: [
          { time: '09:00', name: 'Medina of Tunis', note: 'Explore the winding alleyways', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300' },
          { time: '14:00', name: 'Sidi Bou Said', note: 'The iconic blue-and-white village', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300' },
        ],
      },
      {
        date: 'March 11',
        activities: [
          { time: '08:00', name: 'Sahara Desert Tour', note: 'Full day Sahara experience from Douz', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300' },
        ],
      },
      {
        date: 'March 12',
        activities: [
          { time: '10:00', name: 'Hammamet Beach', note: 'Relax by the Mediterranean', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
        ],
      },
    ],
    createdAt: '2024-03-01',
    views: 1240,
  },
  {
    id: 2,
    title: 'Tunisia Coastal Road Trip',
    startDate: 'April 5, 2024',
    endDate: 'April 10, 2024',
    visibility: 'public',
    authorId: 1,
    authorName: 'Ahmed Ben Ali',
    authorUsername: 'ahmed_adventures',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400',
    ],
    days: [
      {
        date: 'April 5',
        activities: [
          { time: '10:00', name: 'Hammamet Beach', note: 'Start the trip at the coast', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
        ],
      },
      {
        date: 'April 6',
        activities: [
          { time: '09:00', name: 'Sousse Medina', note: 'UNESCO-listed medina', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300' },
        ],
      },
    ],
    createdAt: '2024-03-20',
    views: 860,
  },
  {
    id: 3,
    title: 'Desert & Oasis Adventure',
    startDate: 'May 1, 2024',
    endDate: 'May 4, 2024',
    visibility: 'public',
    authorId: 1,
    authorName: 'Ahmed Ben Ali',
    authorUsername: 'ahmed_adventures',
    photos: [
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    ],
    days: [
      {
        date: 'May 1',
        activities: [
          { time: '08:00', name: 'Sahara Desert Tour', note: 'Camel trek at sunrise', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300' },
        ],
      },
    ],
    createdAt: '2024-04-10',
    views: 620,
  },
]

// ─── Module-level reactive state (singleton) ───────────────────────────────────
const itineraries = ref([])
const loading = ref(false)
const error = ref('')

// ─── Storage helpers ───────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(ITINERARIES_KEY)
    if (stored) {
      set_all_itineraries(JSON.parse(stored))
    } else {
      set_all_itineraries(SEED_ITINERARIES)
      localStorage.setItem(ITINERARIES_KEY, JSON.stringify(get_all_itineraries()))
    }
    itineraries.value = [...get_all_itineraries()]
  } catch {
    set_all_itineraries(SEED_ITINERARIES)
    itineraries.value = [...get_all_itineraries()]
  }
}

function saveToStorage() {
  localStorage.setItem(ITINERARIES_KEY, JSON.stringify(get_all_itineraries()))
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useItineraries() {
  async function fetchItineraries() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      loadFromStorage()
    } catch {
      error.value = 'Failed to load itineraries. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getItineraryById(id) {
    if (itineraries.value.length === 0) loadFromStorage()
    return get_itinerary_by_id(id)
  }

  function getItinerariesByUser(authorId) {
    if (itineraries.value.length === 0) loadFromStorage()
    return get_itineraries_by_author_id(authorId)
  }

  function createItinerary(data, currentUser) {
    if (itineraries.value.length === 0) loadFromStorage()
    const newItinerary = new Itinerary({
      id: Date.now(),
      ...data,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorUsername: currentUser.username,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
    })
    add_itinerary(newItinerary)
    itineraries.value = [...get_all_itineraries()]
    saveToStorage()
    return newItinerary
  }

  function updateItinerary(id, updates) {
    const updated = update_itinerary_by_id(id, updates)
    if (updated) {
      itineraries.value = [...get_all_itineraries()]
      saveToStorage()
    }
    return updated
  }

  function deleteItinerary(id) {
    const deleted = delete_itinerary_by_id(id)
    if (deleted) {
      itineraries.value = [...get_all_itineraries()]
      saveToStorage()
    }
    return deleted
  }

  return {
    itineraries,
    loading,
    error,
    fetchItineraries,
    getItineraryById,
    getItinerariesByUser,
    createItinerary,
    updateItinerary,
    deleteItinerary,
  }
}
