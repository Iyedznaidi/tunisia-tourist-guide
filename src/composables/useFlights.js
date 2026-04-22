import { ref } from 'vue'
import { Flight, set_all_flights, get_all_flights } from '../entities/flight'

// ─── Mocked flight pool ────────────────────────────────────────────────────────
const MOCK_FLIGHTS = [
  { id: 1, airline: 'Tunisair', flightNo: 'TU 751', departTime: '08:30', arriveTime: '11:45', origin: 'CDG', destination: 'TUN', duration: '3h 15m', stops: 'Non-stop', price: 189 },
  { id: 2, airline: 'Air France', flightNo: 'AF 1530', departTime: '10:20', arriveTime: '14:05', origin: 'CDG', destination: 'TUN', duration: '3h 45m', stops: 'Non-stop', price: 245 },
  { id: 3, airline: 'Nouvelair', flightNo: 'BJ 410', departTime: '14:15', arriveTime: '17:30', origin: 'ORY', destination: 'DJE', duration: '3h 15m', stops: 'Non-stop', price: 167 },
  { id: 4, airline: 'Transavia', flightNo: 'TO 3415', departTime: '06:45', arriveTime: '12:30', origin: 'CDG', destination: 'TUN', duration: '5h 45m', stops: '1 Stop', price: 128 },
  { id: 5, airline: 'Ryanair', flightNo: 'FR 5522', departTime: '19:00', arriveTime: '23:45', origin: 'BRU', destination: 'TUN', duration: '4h 45m', stops: 'Non-stop', price: 98 },
  { id: 6, airline: 'Tunisair', flightNo: 'TU 320', departTime: '07:00', arriveTime: '10:20', origin: 'LHR', destination: 'TUN', duration: '3h 20m', stops: 'Non-stop', price: 210 },
  { id: 7, airline: 'Nouvelair', flightNo: 'BJ 205', departTime: '12:50', arriveTime: '16:15', origin: 'MRS', destination: 'DJE', duration: '3h 25m', stops: 'Non-stop', price: 155 },
  { id: 8, airline: 'Transavia', flightNo: 'TO 1840', departTime: '15:30', arriveTime: '21:45', origin: 'AMS', destination: 'TUN', duration: '6h 15m', stops: '1 Stop', price: 139 },
]

// ─── Module-level reactive state (singleton) ───────────────────────────────────
const results = ref([])
const lastSearch = ref(null)
const searching = ref(false)

// ─── Composable ────────────────────────────────────────────────────────────────
export function useFlights() {
  /**
   * Mock flight search. Filters the pool by origin/destination when provided,
   * otherwise returns all flights. Simulates a short network delay.
   */
  async function searchFlights(query = {}) {
    searching.value = true
    lastSearch.value = { ...query }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { origin, destination } = query
      const pool = MOCK_FLIGHTS.filter((f) => {
        const originMatch = !origin || f.origin.toLowerCase().includes(origin.toLowerCase())
        const destMatch =
          !destination ||
          f.destination.toLowerCase().includes(destination.toLowerCase()) ||
          destination.toLowerCase().includes(f.destination.toLowerCase())
        return originMatch && destMatch
      })

      set_all_flights(pool.length > 0 ? pool : MOCK_FLIGHTS)
      results.value = [...get_all_flights()]
    } finally {
      searching.value = false
    }
  }

  return {
    results,
    lastSearch,
    searching,
    searchFlights,
  }
}
