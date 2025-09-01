import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"
import type { TicketDTO } from "../../types"

interface TicketsState {
  byEvent: Record<string, TicketDTO[]>
  loading: boolean
  error: string | null
}

const initialState: TicketsState = {
  byEvent: {},
  loading: false,
  error: null,
}

export const fetchTicketsByEvent = createAsyncThunk<{ eventId: string; tickets: TicketDTO[] }, string>(
  "tickets/fetchByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const { data } = await api.get<TicketDTO[]>(`/tickets/event/${eventId}`)
      return { eventId, tickets: data }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load tickets")
    }
  },
)

const slice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTicketsByEvent.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchTicketsByEvent.fulfilled, (s, a) => {
        s.loading = false
        s.byEvent[a.payload.eventId] = a.payload.tickets
      })
      .addCase(fetchTicketsByEvent.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Failed to load tickets"
      })
  },
})

export default slice.reducer
