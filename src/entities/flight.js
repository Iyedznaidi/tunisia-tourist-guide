export class Flight {
  constructor({
    id,
    airline,
    flightNo,
    departTime,
    arriveTime,
    origin,
    destination,
    duration,
    stops,
    price,
  }) {
    this.id = id
    this.airline = airline
    this.flightNo = flightNo
    this.departTime = departTime
    this.arriveTime = arriveTime
    this.origin = origin
    this.destination = destination
    this.duration = duration
    this.stops = stops
    this.price = price
  }
}

export const FLIGHT_LIST = []
const FLIGHT_FIELDS = [
  'id',
  'airline',
  'flightNo',
  'departTime',
  'arriveTime',
  'origin',
  'destination',
  'duration',
  'stops',
  'price',
]

export function get_all_flights() {
  return FLIGHT_LIST
}

export function set_all_flights(flights) {
  FLIGHT_LIST.length = 0
  flights.forEach((flight) => add_flight(flight))
}

export function add_flight(flight) {
  const flightToAdd = flight instanceof Flight ? flight : new Flight(flight)
  FLIGHT_LIST.push(flightToAdd)
}

export function get_flight_by_id(id) {
  return FLIGHT_LIST.find((flight) => flight.id === Number(id)) || null
}

export function update_flight_by_id(id, updates) {
  const idx = FLIGHT_LIST.findIndex((flight) => flight.id === Number(id))
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (FLIGHT_FIELDS.includes(key)) {
      FLIGHT_LIST[idx][key] = updates[key]
    }
  })
  return FLIGHT_LIST[idx]
}

export function delete_flight_by_id(id) {
  const idx = FLIGHT_LIST.findIndex((flight) => flight.id === Number(id))
  if (idx === -1) return false
  FLIGHT_LIST.splice(idx, 1)
  return true
}
