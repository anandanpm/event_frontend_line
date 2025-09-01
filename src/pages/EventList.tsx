
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchEvents } from "../features/events/eventsSlice"
import { Link } from "react-router-dom"

export default function EventsList() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.events)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  return (
    <div>
      <h2 className="section-title">Upcoming Events</h2>
      {loading && <div className="helper">Loading events...</div>}
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {items.map((e) => (
          <div className="card" key={e.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem" }}>
              <h3 style={{ margin: 0 }}>{e.title}</h3>
              <span className="helper">{new Date(e.date).toLocaleDateString()}</span>
            </div>
            <p className="helper">{e.location}</p>
            <p>
              {e.description?.slice(0, 120)}
              {e.description && e.description.length > 120 ? "…" : ""}
            </p>
            <Link className="btn" to={`/events/${e.id}`}>
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
