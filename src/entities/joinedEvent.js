export class JoinedEvent {
  constructor({ userId, eventId }) {
    this.userId = userId
    this.eventId = Number(eventId)
  }
}

export const JOINED_EVENT_LIST = []

export function get_all_joined_events() {
  return JOINED_EVENT_LIST
}

export function set_all_joined_events(joinedEvents) {
  JOINED_EVENT_LIST.length = 0
  joinedEvents.forEach((joinedEvent) => add_joined_event(joinedEvent))
}

export function add_joined_event(joinedEvent) {
  const joinedEventToAdd =
    joinedEvent instanceof JoinedEvent
      ? joinedEvent
      : new JoinedEvent({ userId: joinedEvent.userId, eventId: joinedEvent.eventId })
  JOINED_EVENT_LIST.push(joinedEventToAdd)
}

export function get_joined_event_by_user_and_event(userId, eventId) {
  return (
    JOINED_EVENT_LIST.find((j) => j.userId === userId && j.eventId === Number(eventId)) || null
  )
}

export function update_joined_event_by_user_and_event(userId, eventId, updates) {
  const idx = JOINED_EVENT_LIST.findIndex(
    (j) => j.userId === userId && j.eventId === Number(eventId),
  )
  if (idx === -1) return null
  if (Object.prototype.hasOwnProperty.call(updates, 'eventId')) {
    JOINED_EVENT_LIST[idx].eventId = Number(updates.eventId)
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'userId')) {
    JOINED_EVENT_LIST[idx].userId = updates.userId
  }
  return JOINED_EVENT_LIST[idx]
}

export function delete_joined_event_by_user_and_event(userId, eventId) {
  const idx = JOINED_EVENT_LIST.findIndex(
    (j) => j.userId === userId && j.eventId === Number(eventId),
  )
  if (idx === -1) return false
  JOINED_EVENT_LIST.splice(idx, 1)
  return true
}
