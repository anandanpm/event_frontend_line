import { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchEventById } from "../features/events/eventsSlice"
import { fetchTicketsByEvent } from "../features/tickets/ticketsSlice"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { createBooking } from "../features/bookings/bookingsSlice"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"

const BookingSchema = Yup.object({
  ticketId: Yup.string().required("Select a ticket"),
  quantity: Yup.number().min(1, "Must be at least 1").required("Required"),
})

export default function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { current: event, loading: eventLoading, error: eventError } = useAppSelector((s) => s.events)
  const { byEvent, loading: ticketsLoading, error: ticketsError } = useAppSelector((s) => s.tickets)
  const auth = useAppSelector((s) => s.auth)
  const { creating, createError, lastBooking } = useAppSelector((s) => s.bookings)

  const tickets = useMemo(() => (id ? byEvent[id] || [] : []), [byEvent, id])
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id))
      dispatch(fetchTicketsByEvent(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    const handlePayment = async () => {
      if (!stripe || !elements || !lastBooking?.clientSecret) return

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      try {
        const result = await stripe.confirmCardPayment(lastBooking.clientSecret, {
          payment_method: { card: cardElement },
        })

        if (result.error) {
          console.error("Payment failed:", result.error.message)
          alert("Payment failed: " + result.error.message)
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          // Navigate to success page with payment intent ID
          navigate(`/payment/success?payment_intent_id=${result.paymentIntent.id}`)
        }
      } catch (error) {
        console.error("Payment error:", error)
        alert("An error occurred during payment processing")
      }
    }

    handlePayment()
  }, [lastBooking, stripe, elements, navigate])

  return (
    <div className="card">
      {eventLoading && <div className="helper">Loading event...</div>}
      {eventError && <div className="error">{eventError}</div>}
      {event && (
        <>
          <h2>{event.title}</h2>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="helper">
              {new Date(event.date).toLocaleString()} • {event.location}
            </div>
          </div>
          <p style={{ marginTop: ".5rem" }}>{event.description}</p>

          <h3 className="section-title">Tickets</h3>
          {ticketsLoading && <div className="helper">Loading tickets...</div>}
          {ticketsError && <div className="error">{ticketsError}</div>}
          {tickets.length === 0 && <div className="helper">No tickets available yet.</div>}

          <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: ".5rem" }}>
            {tickets.map((t) => (
              <li key={t.id} className="row" style={{ justifyContent: "space-between" }}>
                <span>{t.name}</span>
                <span className="helper">${(t.priceCents / 100).toFixed(2)}</span>
                <span className="helper">Qty: {t.totalQuantity ?? 0}</span>
              </li>
            ))}
          </ul>

          <h3 className="section-title">Book tickets</h3>
          {!auth.user && <div className="helper">Please log in to book tickets.</div>}

          <Formik
            initialValues={{ ticketId: "", quantity: 1 }}
            validationSchema={BookingSchema}
            onSubmit={(values) => {
              if (!auth.user) return
              dispatch(
                createBooking({
                  userId: auth.user._id,
                  ticketId: values.ticketId,
                  quantity: Number(values.quantity),
                })
              )
            }}
          >
            {({ isSubmitting }) => (
              <Form className="form" style={{ maxWidth: 520 }}>
                <div>
                  <label className="label" htmlFor="ticketId">Ticket</label>
                  <Field as="select" className="select" id="ticketId" name="ticketId" disabled={!auth.user}>
                    <option value="">Select ticket</option>
                    {tickets.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — ${(t.priceCents / 100).toFixed(2)}
                      </option>
                    ))}
                  </Field>
                  <div className="error"><ErrorMessage name="ticketId" /></div>
                </div>

                <div>
                  <label className="label" htmlFor="quantity">Quantity</label>
                  <Field className="input" type="number" id="quantity" name="quantity" min={1} disabled={!auth.user} />
                  <div className="error"><ErrorMessage name="quantity" /></div>
                </div>

                <div>
                  <label className="label">Card details</label>
                  <div className="input" style={{ padding: "10px" }}>
                    <CardElement options={{ hidePostalCode: true }} />
                  </div>
                </div>

                {createError && <div className="error">{createError}</div>}
                <button className="btn" type="submit" disabled={isSubmitting || creating || !auth.user}>
                  {creating ? "Creating booking..." : "Book & Pay"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  )
}