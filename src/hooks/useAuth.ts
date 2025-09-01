"use client"

import { useAppSelector } from "../store/hooks"

export function useAuth() {
  const { user, token } = useAppSelector((s) => s.auth)
  return { user, token, isAuthenticated: Boolean(user && token) }
}
