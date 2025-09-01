import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import eventsReducer from "../features/events/eventsSlice"
import ticketsReducer from "../features/tickets/ticketsSlice"
import bookingsReducer from "../features/bookings/bookingsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    tickets: ticketsReducer,
    bookings: bookingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
