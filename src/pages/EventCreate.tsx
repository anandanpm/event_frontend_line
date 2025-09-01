import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "../store"
import { createEvent } from "../features/events/eventsSlice"
import "./EventCreate.scss"

const EventSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  date: Yup.string().required("Date/time is required"),
  capacity: Yup.number().min(1, "Capacity must be at least 1").required("Capacity is required"),
  price: Yup.number().min(0, "Price must be non-negative").required("Price is required"),
})

export default function EventCreate() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s: RootState) => s.events)

  return (
    <main className="event-create container">
      <h1>Create Event</h1>

      <Formik
        initialValues={{
          title: "",
          description: "",
          location: "",
          date: "",
          capacity: 50, // default capacity
          price: 10, // default price
        }}
        validationSchema={EventSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              ...values,
              date: new Date(values.date).toISOString(), // ✅ ensure ISO format
            }
            const res = await dispatch(createEvent(payload))
            if ((res as any).meta.requestStatus === "fulfilled") {
              navigate("/events")
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <div className="row">
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" placeholder="Event title" />
              <ErrorMessage component="div" className="error" name="title" />
            </div>

            <div className="row">
              <label htmlFor="description">Description</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Describe your event"
              />
              <ErrorMessage component="div" className="error" name="description" />
            </div>

            <div className="row">
              <label htmlFor="location">Location</label>
              <Field id="location" name="location" placeholder="City, Venue" />
              <ErrorMessage component="div" className="error" name="location" />
            </div>

            <div className="row">
              <label htmlFor="date">Date</label>
              <Field id="date" name="date" type="datetime-local" />
              <ErrorMessage component="div" className="error" name="date" />
            </div>

            <div className="row">
              <label htmlFor="capacity">Capacity</label>
              <Field id="capacity" name="capacity" type="number" min="1" />
              <ErrorMessage component="div" className="error" name="capacity" />
            </div>

            <div className="row">
              <label htmlFor="price">Ticket Price</label>
              <Field id="price" name="price" type="number" step="0.01" min="0" />
              <ErrorMessage component="div" className="error" name="price" />
            </div>

            {error ? <div className="error global">{error}</div> : null}

            <div className="actions">
              <button type="submit" className="btn primary" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  )
}
