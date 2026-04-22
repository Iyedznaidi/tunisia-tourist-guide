import { ref } from 'vue'
import {
  Activity,
  get_all_activities,
  get_activity_by_id,
  set_all_activities,
} from '../entities/activity'

// ─── LocalStorage key ──────────────────────────────────────────────────────────
const ACTIVITIES_KEY = 'ttg_activities'

// ─── Seed data ─────────────────────────────────────────────────────────────────
const SEED_ACTIVITIES = [
  {
    id: 1,
    name: 'Medina of Tunis',
    city: 'Tunis',
    tags: ['Culture', 'History', 'UNESCO'],
    rating: 4.8,
    description:
      'The Medina of Tunis is a UNESCO World Heritage Site and one of the finest examples of Arab-Muslim civilisation. Wander through winding streets lined with mosques, palaces, and bustling souks.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200',
    price: '25 TND',
    duration: '3–4 hours',
    difficulty: 'Easy',
    season: 'Spring / Autumn',
  },
  {
    id: 2,
    name: 'Sahara Desert Tour',
    city: 'Douz',
    tags: ['Desert', 'Adventure'],
    rating: 4.9,
    description: 'Ride camels and camp under Saharan skies. A full-day tour deep into the Tunisian Sahara from the gateway town of Douz.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200',
    price: '90 TND',
    duration: 'Full day',
    difficulty: 'Moderate',
    season: 'Autumn / Winter',
  },
  {
    id: 3,
    name: 'Hammamet Beach',
    city: 'Hammamet',
    tags: ['Sea', 'Relax'],
    rating: 4.7,
    description: 'Crystal clear Mediterranean waters at one of Tunisia\'s finest beach resorts. Ideal for swimming, sunbathing, and water sports.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    price: 'Free',
    duration: 'Half day',
    difficulty: 'Easy',
    season: 'Summer',
  },
  {
    id: 4,
    name: 'El Jem Amphitheatre',
    city: 'El Jem',
    tags: ['History'],
    rating: 4.8,
    description: 'One of the best-preserved Roman colosseums in the world, capable of holding 35,000 spectators. A UNESCO World Heritage Site.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200',
    price: '12 TND',
    duration: '2 hours',
    difficulty: 'Easy',
    season: 'All year',
  },
  {
    id: 5,
    name: 'Sidi Bou Said',
    city: 'Tunis',
    tags: ['Culture', 'City Life'],
    rating: 4.6,
    description: 'The iconic blue-and-white village perched on a cliff above the Gulf of Tunis. Charming cafés, art galleries, and sea views.',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200',
    price: 'Free',
    duration: '2–3 hours',
    difficulty: 'Easy',
    season: 'All year',
  },
  {
    id: 6,
    name: 'Djerba Island',
    city: 'Djerba',
    tags: ['Sea', 'Relax'],
    rating: 4.7,
    description: 'Island getaway with pristine beaches, whitewashed villages, and the famous El Ghriba synagogue. Rich blend of cultures.',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200',
    price: '50 TND',
    duration: '2–3 days',
    difficulty: 'Easy',
    season: 'Spring / Summer',
  },
  {
    id: 7,
    name: 'Bardo Museum',
    city: 'Tunis',
    tags: ['History', 'Culture'],
    rating: 4.5,
    description: 'Home to the world\'s finest collection of Roman mosaics housed in a former royal palace. A treasure trove of antiquity.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200',
    price: '11 TND',
    duration: '2–3 hours',
    difficulty: 'Easy',
    season: 'All year',
  },
  {
    id: 8,
    name: 'Ichkeul National Park',
    city: 'Bizerte',
    tags: ['Hiking', 'Nature'],
    rating: 4.4,
    description: 'UNESCO biosphere reserve featuring a freshwater lake, marshlands, and diverse wildlife including flamingos and migratory birds.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
    price: '5 TND',
    duration: 'Half day',
    difficulty: 'Moderate',
    season: 'Autumn / Winter',
  },
]

// ─── Module-level reactive state (singleton) ───────────────────────────────────
const activities = ref([])
const loading = ref(false)
const error = ref('')

// ─── Storage helpers ───────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(ACTIVITIES_KEY)
    if (stored) {
      set_all_activities(JSON.parse(stored))
    } else {
      set_all_activities(SEED_ACTIVITIES)
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(get_all_activities()))
    }
    activities.value = [...get_all_activities()]
  } catch {
    set_all_activities(SEED_ACTIVITIES)
    activities.value = [...get_all_activities()]
  }
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useActivities() {
  async function fetchActivities() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      loadFromStorage()
    } catch {
      error.value = 'Failed to load activities. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getActivityById(id) {
    if (activities.value.length === 0) loadFromStorage()
    return get_activity_by_id(id)
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
    getActivityById,
  }
}
