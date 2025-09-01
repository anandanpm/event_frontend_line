"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { logout, logoutUser } from "../features/auth/authSlice"

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
    } finally {
      dispatch(logout())
      navigate("/login")
    }
  }

  return (
    <header className="navbar">
      <div className="inner container">
        <div className="brand">
          <span>🎟️</span>
          <Link to="/events">Event Booking</Link>
        </div>
        <nav className="links">
          <Link to="/events">Events</Link>
          {user && (user.role === "admin" || user.role === "organizer") && (
            <Link to="/events/create">Create Event</Link>
          )}
          {user && <Link to="/bookings">My Bookings</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && (
            <>
              <span className="helper">Hi, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
