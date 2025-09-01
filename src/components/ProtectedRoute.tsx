import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "../store/hooks"

type AllowedRole = "admin" | "organizer" | "user"

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: AllowedRole[]
}) {
  const { user } = useAppSelector((s) => s.auth)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }


  const userRole = (user.role || "").toLowerCase() as AllowedRole

  if (roles && !roles.includes(userRole)) {

    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
