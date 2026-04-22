export class ItineraryDay {
  constructor({ date, activities }) {
    this.date = date || ''
    this.activities = activities || []
  }
}

export class Itinerary {
  constructor({
    id,
    title,
    startDate,
    endDate,
    visibility,
    authorId,
    authorName,
    authorUsername,
    days,
    photos,
    createdAt,
    views,
  }) {
    this.id = id
    this.title = title
    this.startDate = startDate || ''
    this.endDate = endDate || ''
    this.visibility = visibility || 'public'
    this.authorId = authorId
    this.authorName = authorName
    this.authorUsername = authorUsername
    this.days = (days || []).map((d) =>
      d instanceof ItineraryDay ? d : new ItineraryDay(d),
    )
    this.photos = photos || []
    this.createdAt = createdAt || new Date().toISOString().split('T')[0]
    this.views = views || 0
  }
}

export const ITINERARY_LIST = []
const ITINERARY_SCALAR_FIELDS = [
  'id',
  'title',
  'startDate',
  'endDate',
  'visibility',
  'authorId',
  'authorName',
  'authorUsername',
  'photos',
  'createdAt',
  'views',
]

export function get_all_itineraries() {
  return ITINERARY_LIST
}

export function set_all_itineraries(itineraries) {
  ITINERARY_LIST.length = 0
  itineraries.forEach((itinerary) => add_itinerary(itinerary))
}

export function add_itinerary(itinerary) {
  const itineraryToAdd = itinerary instanceof Itinerary ? itinerary : new Itinerary(itinerary)
  ITINERARY_LIST.push(itineraryToAdd)
}

export function get_itinerary_by_id(id) {
  return ITINERARY_LIST.find((itinerary) => itinerary.id === Number(id)) || null
}

export function get_itineraries_by_author_id(authorId) {
  return ITINERARY_LIST.filter((itinerary) => itinerary.authorId === authorId)
}

export function update_itinerary_by_id(id, updates) {
  const idx = ITINERARY_LIST.findIndex((itinerary) => itinerary.id === Number(id))
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (ITINERARY_SCALAR_FIELDS.includes(key)) {
      ITINERARY_LIST[idx][key] = updates[key]
    } else if (key === 'days') {
      ITINERARY_LIST[idx].days = (updates.days || []).map((d) =>
        d instanceof ItineraryDay ? d : new ItineraryDay(d),
      )
    }
  })
  return ITINERARY_LIST[idx]
}

export function delete_itinerary_by_id(id) {
  const idx = ITINERARY_LIST.findIndex((itinerary) => itinerary.id === Number(id))
  if (idx === -1) return false
  ITINERARY_LIST.splice(idx, 1)
  return true
}
