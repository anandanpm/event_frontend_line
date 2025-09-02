import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const paymentIntentId = params.get("payment_intent_id")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment intent ID found")
      return
    }

    const checkBookingStatus = async () => {
      try {
        const res = await fetch(`/api/bookings/by-payment-intent/${paymentIntentId}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        const booking = await res.json()
        if (booking.status === "paid") {
          setReady(true)
          return true
        }
        return false
      } catch (err) {
        console.error("Error checking booking status:", err)
        return false
      }
    }

    // Check immediately first
    checkBookingStatus().then(isReady => {
      if (!isReady) {
        // If not ready, start polling
        const interval = setInterval(async () => {
          const isReady = await checkBookingStatus()
          if (isReady) {
            clearInterval(interval)
          }
        }, 2000)

        // Stop polling after 2 minutes
        const timeout = setTimeout(() => {
          clearInterval(interval)
          if (!ready) {
            setError("Booking confirmation is taking longer than expected. Please check your bookings page.")
          }
        }, 120000)

        return () => {
          clearInterval(interval)
          clearTimeout(timeout)
        }
      }
    })
  }, [paymentIntentId, ready])

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: "2rem auto", textAlign: "center" }}>
        <h2>Payment Processing</h2>
        <p className="error">{error}</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link className="btn" to="/bookings">
            View my bookings
          </Link>
          <Link className="btn secondary" to="/events">
            Back to events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ maxWidth: 640, margin: "2rem auto", textAlign: "center" }}>
      <h2>Payment successful 🎉</h2>
      <p className="helper">Payment Intent: {paymentIntentId ?? "N/A"}</p>
      {ready ? (
        <>
          <p>Your booking has been confirmed! You may receive a confirmation email.</p>
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