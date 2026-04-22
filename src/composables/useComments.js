import { ref } from 'vue'
import {
  Comment,
  get_all_comments,
  get_comments_by_itinerary_id,
  set_all_comments,
  add_comment,
} from '../entities/comment'

// ─── LocalStorage key ──────────────────────────────────────────────────────────
const COMMENTS_KEY = 'ttg_itinerary_comments'

// ─── Seed data ─────────────────────────────────────────────────────────────────
const SEED_COMMENTS = [
  { id: 1, itineraryId: 1, authorId: 98, authorName: 'Karim T.', text: 'Amazing itinerary! I did something similar last summer.', createdAt: '2024-03-15T10:00:00Z' },
  { id: 2, itineraryId: 1, authorId: 97, authorName: 'Sana M.', text: 'Adding this to my wish list 🌟', createdAt: '2024-03-14T12:30:00Z' },
  { id: 3, itineraryId: 2, authorId: 99, authorName: 'Amira B.', text: 'The coastal road is absolutely stunning!', createdAt: '2024-04-06T09:15:00Z' },
]

// ─── Module-level reactive state (singleton) ───────────────────────────────────
const comments = ref([])

// ─── Storage helpers ───────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(COMMENTS_KEY)
    if (stored) {
      set_all_comments(JSON.parse(stored))
    } else {
      set_all_comments(SEED_COMMENTS)
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(get_all_comments()))
    }
    comments.value = [...get_all_comments()]
  } catch {
    set_all_comments(SEED_COMMENTS)
    comments.value = [...get_all_comments()]
  }
}

function saveToStorage() {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(get_all_comments()))
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useComments() {
  function fetchComments(itineraryId) {
    if (comments.value.length === 0) loadFromStorage()
    return get_comments_by_itinerary_id(itineraryId)
  }

  function addComment(itineraryId, currentUser, text) {
    if (!text || !text.trim()) return null
    if (comments.value.length === 0) loadFromStorage()
    const newComment = new Comment({
      id: Date.now(),
      itineraryId: Number(itineraryId),
      authorId: currentUser?.id ?? 0,
      authorName: currentUser?.fullName ?? 'Anonymous',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    })
    add_comment(newComment)
    comments.value = [...get_all_comments()]
    saveToStorage()
    return newComment
  }

  return {
    comments,
    fetchComments,
    addComment,
  }
}
