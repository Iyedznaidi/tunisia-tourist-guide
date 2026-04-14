export class Message {
  constructor({
    id,
    eventId,
    senderId,
    senderName,
    text,
    timestamp,
  }) {
    this.id = id
    this.eventId = Number(eventId)
    this.senderId = senderId
    this.senderName = senderName
    this.text = text
    this.timestamp = timestamp
  }
}

export const MESSAGE_LIST = []

export function get_all_messages() {
  return MESSAGE_LIST
}

export function set_all_messages(messages) {
  MESSAGE_LIST.length = 0
  messages.forEach((message) => add_message(message))
}

export function add_message(message) {
  const messageToAdd = message instanceof Message ? message : new Message(message)
  MESSAGE_LIST.push(messageToAdd)
}

export function get_message_by_id(id) {
  return MESSAGE_LIST.find((message) => message.id === Number(id)) || null
}

export function get_messages_by_event_id(eventId) {
  return MESSAGE_LIST.filter((message) => message.eventId === Number(eventId))
}

export function update_message_by_id(id, updates) {
  const idx = MESSAGE_LIST.findIndex((message) => message.id === Number(id))
  if (idx === -1) return null
  Object.assign(MESSAGE_LIST[idx], updates)
  return MESSAGE_LIST[idx]
}

export function delete_message_by_id(id) {
  const idx = MESSAGE_LIST.findIndex((message) => message.id === Number(id))
  if (idx === -1) return false
  MESSAGE_LIST.splice(idx, 1)
  return true
}
