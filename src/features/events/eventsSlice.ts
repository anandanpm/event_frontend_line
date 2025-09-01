import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"
import type { EventDTO, TicketDTO } from "../../types"

interface EventsState {
  items: EventDTO[]
  current: EventDTO | null
  loading: boolean
  error: string | null
}

const initialState: EventsState = {
  items: [],
  current: null,
  loading: false,
  error: null,
}

// Fetch all events WITH tickets
export const fetchEvents = createAsyncThunk<EventDTO[]>(
  "events/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data: events } = await api.get<EventDTO[]>("/events")

      // fetch tickets for each event
      const eventsWithTickets = await Promise.all(
        events.map(async (event) => {
          try {
            const { data: tickets } = await api.get<TicketDTO[]>(`/tickets/event/${event.id}`)
            console.log(eventsWithTickets,'is the ticket is comming or not')
            return { ...event, tickets }
            
          } catch {
            // if no tickets or error, still return event
            return { ...event, tickets: [] }
          }
        })
      )

      return eventsWithTickets
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load events")
    }
  },
)

// Fetch one event (with tickets)
export const fetchEventById = createAsyncThunk<EventDTO, string>(
  "events/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data: event } = await api.get<EventDTO>(`/events/${id}`)
      try {
        const { data: tickets } = await api.get<TicketDTO[]>(`/tickets/event/${id}`)
        return { ...event, tickets }
      } catch {
        return { ...event, tickets: [] }
      }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load event")
    }
  },
)

type CreateEventPayload = {
  title: string
  description: string
  location: string
  date: string
  capacity: number
  price: number
}

export const createEvent = createAsyncThunk<EventDTO, CreateEventPayload>(
  "events/create",
  async (payload, { rejectWithValue }) => {
    try {
      // Step 1: Create Event
      const { data: event } = await api.post<EventDTO>("/events", {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        date: payload.date,
      })

      // Step 2: Create Default Ticket for this Event
      const { data: ticket } = await api.post<TicketDTO>(`/tickets/event/${event.id}`, {
        name: "General Admission",
        priceCents: Math.round(payload.price * 100),
        totalQuantity: payload.capacity,
      })

      // Step 3: Attach the ticket to the event
      return { ...event, tickets: [ticket] }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create event & ticket")
    }
  },
)

const slice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEvents.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(fetchEvents.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Failed to load events"
      })
      .addCase(fetchEventById.pending, (s) => {
        s.loading = true
        s.error = null
        s.current = null
      })
      .addCase(fetchEventById.fulfilled, (s, a) => {
        s.loading = false
        s.current = a.payload
      })
      .addCase(fetchEventById.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Failed to load event"
      })
      .addCase(createEvent.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(createEvent.fulfilled, (s, a) => {
        s.loading = false
        s.items = [a.payload, ...s.items]
        s.current = a.payload
      })
      .addCase(createEvent.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Failed to create event"
      })
  },
})

export default slice.reducer
