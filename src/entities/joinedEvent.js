export class JoinedEvent {
  constructor({ eventId }) {
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
      : new JoinedEvent(
          typeof joinedEvent === 'number'
            ? { eventId: joinedEvent }
            : { eventId: joinedEvent.eventId },
        )
  JOINED_EVENT_LIST.push(joinedEventToAdd)
}

export function get_joined_event_by_event_id(eventId) {
  return JOINED_EVENT_LIST.find((joinedEvent) => joinedEvent.eventId === Number(eventId)) || null
}

export function update_joined_event_by_event_id(eventId, updates) {
  const idx = JOINED_EVENT_LIST.findIndex((joinedEvent) => joinedEvent.eventId === Number(eventId))
  if (idx === -1) return null
  Object.assign(JOINED_EVENT_LIST[idx], updates)
  return JOINED_EVENT_LIST[idx]
}

export function delete_joined_event_by_event_id(eventId) {
  const idx = JOINED_EVENT_LIST.findIndex((joinedEvent) => joinedEvent.eventId === Number(eventId))
  if (idx === -1) return false
  JOINED_EVENT_LIST.splice(idx, 1)
  return true
}
