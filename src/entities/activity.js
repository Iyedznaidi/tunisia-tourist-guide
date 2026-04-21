export class Activity {
  constructor({
    id,
    name,
    city,
    tags,
    rating,
    description,
    image,
    price,
    duration,
    difficulty,
    season,
  }) {
    this.id = id
    this.name = name
    this.city = city
    this.tags = tags || []
    this.rating = rating
    this.description = description
    this.image = image
    this.price = price
    this.duration = duration
    this.difficulty = difficulty
    this.season = season
  }
}

export const ACTIVITY_LIST = []
const ACTIVITY_FIELDS = [
  'id',
  'name',
  'city',
  'tags',
  'rating',
  'description',
  'image',
  'price',
  'duration',
  'difficulty',
  'season',
]

export function get_all_activities() {
  return ACTIVITY_LIST
}

export function set_all_activities(activities) {
  ACTIVITY_LIST.length = 0
  activities.forEach((activity) => add_activity(activity))
}

export function add_activity(activity) {
  const activityToAdd = activity instanceof Activity ? activity : new Activity(activity)
  ACTIVITY_LIST.push(activityToAdd)
}

export function get_activity_by_id(id) {
  return ACTIVITY_LIST.find((activity) => activity.id === Number(id)) || null
}

export function update_activity_by_id(id, updates) {
  const idx = ACTIVITY_LIST.findIndex((activity) => activity.id === Number(id))
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (ACTIVITY_FIELDS.includes(key)) {
      ACTIVITY_LIST[idx][key] = updates[key]
    }
  })
  return ACTIVITY_LIST[idx]
}

export function delete_activity_by_id(id) {
  const idx = ACTIVITY_LIST.findIndex((activity) => activity.id === Number(id))
  if (idx === -1) return false
  ACTIVITY_LIST.splice(idx, 1)
  return true
}
