import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/axios"
import type { BookingDTO } from "../../types"

interface BookingsState {
  items: BookingDTO[]
  loading: boolean
  error: string | null
  creating: boolean
  createError: string | null
  lastBooking: BookingDTO | null
}

const initialState: BookingsState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  lastBooking: null,
}


export const fetchMyBookings = createAsyncThunk<BookingDTO[], { userId: string }>(
  "bookings/fetchMine",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const { data } = await api.get<BookingDTO[]>(`/bookings/me?userId=${userId}`)
      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load bookings")
    }
  }
)



export const createBooking = createAsyncThunk<
  BookingDTO,
  { userId: string; ticketId: string; quantity: number }
>(
  "bookings/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<BookingDTO>("/bookings", payload)
      console.log("Booking data:", data)
      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create booking")
    }
  }
)

const slice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMyBookings.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchMyBookings.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(fetchMyBookings.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Failed to load bookings"
      })
      .addCase(createBooking.pending, (s) => {
        s.creating = true
        s.createError = null
        s.lastBooking = null
      })
      .addCase(createBooking.fulfilled, (s, a) => {
        s.creating = false
        s.lastBooking = a.payload
      })
      .addCase(createBooking.rejected, (s, a: any) => {
        s.creating = false
        s.createError = a.payload || "Failed to create booking"
      })
  },
})

export default slice.reducer
