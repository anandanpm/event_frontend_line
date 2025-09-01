import { Route, Routes, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventsList from "./pages/EventList"
import EventDetails from "./pages/EventDetails"
import EventCreate from "./pages/EventCreate"
import MyBookings from "./pages/MyBookings"
import PaymentSuccess from "./pages/PaymentSuccess"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventsList />} />

          {/* 👇 Put /events/create BEFORE /events/:id */}
          <Route
            path="/events/create"
            element={
              <ProtectedRoute roles={["organizer", "admin"]}>
                <EventCreate />
              </ProtectedRoute>
            }
          />

          <Route path="/events/:id" element={<EventDetails />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}