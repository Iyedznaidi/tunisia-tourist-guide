export class Review {
  constructor({ id, activityId, authorId, authorName, rating, text, date }) {
    this.id = id
    this.activityId = Number(activityId)
    this.authorId = authorId
    this.authorName = authorName
    this.rating = rating
    this.text = text
    this.date = date
  }
}

export const REVIEW_LIST = []
const REVIEW_FIELDS = ['id', 'activityId', 'authorId', 'authorName', 'rating', 'text', 'date']

export function get_all_reviews() {
  return REVIEW_LIST
}

export function set_all_reviews(reviews) {
  REVIEW_LIST.length = 0
  reviews.forEach((review) => add_review(review))
}

export function add_review(review) {
  const reviewToAdd = review instanceof Review ? review : new Review(review)
  REVIEW_LIST.push(reviewToAdd)
}

export function get_review_by_id(id) {
  return REVIEW_LIST.find((review) => review.id === Number(id)) || null
}

export function get_reviews_by_activity_id(activityId) {
  return REVIEW_LIST.filter((review) => review.activityId === Number(activityId))
}

export function update_review_by_id(id, updates) {
  const idx = REVIEW_LIST.findIndex((review) => review.id === Number(id))
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (REVIEW_FIELDS.includes(key)) {
      REVIEW_LIST[idx][key] = updates[key]
    }
  })
  return REVIEW_LIST[idx]
}

export function delete_review_by_id(id) {
  const idx = REVIEW_LIST.findIndex((review) => review.id === Number(id))
  if (idx === -1) return false
  REVIEW_LIST.splice(idx, 1)
  return true
}
