

import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")
  const [ready, setReady] = useState(false)

useEffect(() => {
  const interval = setInterval(async () => {
    if (!sessionId) return
    try {
      const res = await fetch(`/api/bookings/by-payment-intent/${sessionId}`)
      const booking = await res.json()
      if (booking.status === "paid") {
        setReady(true)
        clearInterval(interval)
      }
    } catch (err) {
      console.error(err)
    }
  }, 2000)

  return () => clearInterval(interval)
}, [sessionId])


  return (
    <div className="card" style={{ maxWidth: 640, margin: "2rem auto", textAlign: "center" }}>
      <h2>Payment successful 🎉</h2>
      <p className="helper">Session: {sessionId ?? "N/A"}</p>
      {ready ? (
        <>
          <p>Your booking should be confirmed shortly. You may receive a confirmation email.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn" to="/bookings">
              View my bookings
            </Link>
            <Link className="btn secondary" to="/events">
              Back to events
            </Link>
          </div>
        </>
      ) : (
        <p className="helper">Finalizing your booking...</p>
      )}
    </div>
  )
}
