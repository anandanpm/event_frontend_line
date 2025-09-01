
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchMyBookings } from "../features/bookings/bookingsSlice"

export default function MyBookings() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((s) => s.auth) // get auth state
  const { items, loading, error } = useAppSelector((s) => s.bookings)

  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchMyBookings({ userId: auth.user._id }))
    }
  }, [dispatch, auth.user?._id])

  return (
    <div className="card">
      <h2>My Bookings</h2>
      {loading && <div className="helper">Loading bookings...</div>}
      {error && <div className="error">{error}</div>}
      {items.length === 0 && !loading && <div className="helper">No bookings yet.</div>}
   <div className="grid">
  {items.map((b) => (
    <div key={b.id.toString()} className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <strong>Booking #{b.id.toString()}</strong>
        <span
          className={b.status === "paid" ? "btn success" : "btn secondary"}
          style={{ pointerEvents: "none" }}
        >
          {b.status.toUpperCase()}
        </span>
      </div>
      <div className="helper">Ticket: {b.ticketId}</div>
      <div className="helper">Quantity: {b.quantity}</div>
    </div>
  ))}
</div>


    </div>
  )
}
