export class Event {
  constructor({
    id,
    title,
    description,
    type,
    location,
    date,
    time,
    maxAttendees,
    attendees,
    price,
    hostId,
    hostName,
    image,
    tags,
    createdAt,
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.type = type
    this.location = location
    this.date = date
    this.time = time
    this.maxAttendees = maxAttendees
    this.attendees = attendees
    this.price = price
    this.hostId = hostId
    this.hostName = hostName
    this.image = image
    this.tags = tags
    this.createdAt = createdAt
  }
}

export const EVENT_LIST = []

export function get_all_events() {
  return EVENT_LIST
}

export function set_all_events(events) {
  EVENT_LIST.length = 0
  events.forEach((event) => add_event(event))
}

export function add_event(event) {
  const eventToAdd = event instanceof Event ? event : new Event(event)
  EVENT_LIST.push(eventToAdd)
}

export function get_event_by_id(id) {
  return EVENT_LIST.find((event) => event.id === Number(id)) || null
}

export function update_event_by_id(id, updates) {
  const idx = EVENT_LIST.findIndex((event) => event.id === Number(id))
  if (idx === -1) return null
  EVENT_LIST[idx] = { ...EVENT_LIST[idx], ...updates }
  return EVENT_LIST[idx]
}

export function delete_event_by_id(id) {
  const idx = EVENT_LIST.findIndex((event) => event.id === Number(id))
  if (idx === -1) return false
  EVENT_LIST.splice(idx, 1)
  return true
}
