export class Comment {
  constructor({ id, itineraryId, authorId, authorName, text, createdAt }) {
    this.id = id
    this.itineraryId = Number(itineraryId)
    this.authorId = authorId
    this.authorName = authorName
    this.text = text
    this.createdAt = createdAt
  }
}

export const COMMENT_LIST = []
const COMMENT_FIELDS = ['id', 'itineraryId', 'authorId', 'authorName', 'text', 'createdAt']

export function get_all_comments() {
  return COMMENT_LIST
}

export function set_all_comments(comments) {
  COMMENT_LIST.length = 0
  comments.forEach((comment) => add_comment(comment))
}

export function add_comment(comment) {
  const commentToAdd = comment instanceof Comment ? comment : new Comment(comment)
  COMMENT_LIST.push(commentToAdd)
}

export function get_comment_by_id(id) {
  return COMMENT_LIST.find((comment) => comment.id === Number(id)) || null
}

export function get_comments_by_itinerary_id(itineraryId) {
  return COMMENT_LIST.filter((comment) => comment.itineraryId === Number(itineraryId))
}

export function update_comment_by_id(id, updates) {
  const idx = COMMENT_LIST.findIndex((comment) => comment.id === Number(id))
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (COMMENT_FIELDS.includes(key)) {
      COMMENT_LIST[idx][key] = updates[key]
    }
  })
  return COMMENT_LIST[idx]
}

export function delete_comment_by_id(id) {
  const idx = COMMENT_LIST.findIndex((comment) => comment.id === Number(id))
  if (idx === -1) return false
  COMMENT_LIST.splice(idx, 1)
  return true
}
