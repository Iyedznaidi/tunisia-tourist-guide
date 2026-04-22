import { ref } from 'vue'
import {
  Review,
  get_all_reviews,
  get_reviews_by_activity_id,
  set_all_reviews,
  add_review,
} from '../entities/review'

// ─── LocalStorage key ──────────────────────────────────────────────────────────
const REVIEWS_KEY = 'ttg_reviews'

// ─── Seed data ─────────────────────────────────────────────────────────────────
const SEED_REVIEWS = [
  { id: 1, activityId: 1, authorId: 99, authorName: 'Amira B.', rating: 5, text: 'Absolutely magical place. The souks are full of life!', date: 'Feb 2024' },
  { id: 2, activityId: 1, authorId: 98, authorName: 'Karim T.', rating: 4, text: 'Rich history and culture. A must-visit for history lovers.', date: 'Jan 2024' },
  { id: 3, activityId: 1, authorId: 97, authorName: 'Sana M.', rating: 5, text: 'Stunning architecture. Highly recommend the guided tour.', date: 'Dec 2023' },
  { id: 4, activityId: 2, authorId: 1, authorName: 'Ahmed Ben Ali', rating: 5, text: 'Life-changing experience under the stars.', date: 'Jan 2024' },
  { id: 5, activityId: 3, authorId: 99, authorName: 'Amira B.', rating: 4, text: 'Beautiful beach, perfect for a relaxing day.', date: 'Mar 2024' },
]

// ─── Module-level reactive state (singleton) ───────────────────────────────────
const reviews = ref([])

// ─── Storage helpers ───────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(REVIEWS_KEY)
    if (stored) {
      set_all_reviews(JSON.parse(stored))
    } else {
      set_all_reviews(SEED_REVIEWS)
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(get_all_reviews()))
    }
    reviews.value = [...get_all_reviews()]
  } catch {
    set_all_reviews(SEED_REVIEWS)
    reviews.value = [...get_all_reviews()]
  }
}

function saveToStorage() {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(get_all_reviews()))
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useReviews() {
  function fetchReviewsByActivity(activityId) {
    if (reviews.value.length === 0) loadFromStorage()
    return get_reviews_by_activity_id(activityId)
  }

  function addReview(activityId, currentUser, { rating, text }) {
    if (reviews.value.length === 0) loadFromStorage()
    const now = new Date()
    const dateStr = now.toLocaleString('en-US', { month: 'short', year: 'numeric' })
    const newReview = new Review({
      id: Date.now(),
      activityId: Number(activityId),
      authorId: currentUser?.id ?? 0,
      authorName: currentUser?.fullName ?? 'Anonymous',
      rating,
      text,
      date: dateStr,
    })
    add_review(newReview)
    reviews.value = [...get_all_reviews()]
    saveToStorage()
    return newReview
  }

  return {
    reviews,
    fetchReviewsByActivity,
    addReview,
  }
}
