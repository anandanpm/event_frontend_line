import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api, { setToken, clearToken, getToken } from "../../api/axios"
import type { UserDTO, Role } from "../../types"

// The backend response when logging in/registering
export interface AuthResponse {
  token: string
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: UserDTO | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: getToken(), // ✅ load token if already in localStorage
  loading: false,
  error: null,
}

export const login = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload)
      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Login failed")
    }
  },
)

export const register = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload)
    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Register failed")
  }
})

export const fetchCurrentUser = createAsyncThunk<UserDTO | null>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<any>("/auth/me")
      return (data?.user ?? data) as UserDTO
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch current user")
    }
  },
)

export const logoutUser = createAsyncThunk<void>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout")
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Logout failed")
  }
})

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      clearToken()
    },
  },
  extraReducers(builder) {
    builder
      // login
      .addCase(login.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false
        const { token, id, name, email, role } = a.payload
        s.user = { _id: id, name, email, role } // ✅ normalize id → _id
        s.token = token
        if (token) setToken(token)
      })
      .addCase(login.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Login failed"
      })
      // register
      .addCase(register.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false
        const { token, id, name, email, role } = a.payload
        s.user = { _id: id, name, email, role }
        s.token = token
        if (token) setToken(token)
      })
      .addCase(register.rejected, (s, a: any) => {
        s.loading = false
        s.error = a.payload || "Register failed"
      })
      // fetch user
      .addCase(fetchCurrentUser.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.loading = false
        s.user = a.payload
      })
      .addCase(fetchCurrentUser.rejected, (s, a: any) => {
        s.loading = false
        s.user = null
        s.error = a.payload || "Failed to fetch current user"
      })
      // logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null
        s.token = null
        clearToken()
      })
  },
})

export const { logout } = slice.actions
export { register as registerUser }
export default slice.reducer
