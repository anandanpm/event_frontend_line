
export type Role = "user" | "organizer" | "admin"

export interface UserDTO {
  _id: string
  name: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  User: UserDTO
}


export interface TicketDTO {
  id: string
  eventId: string
  name: string
  priceCents: number
  totalQuantity: number
  remainingQuantity: number
  createdAt: string
  updatedAt: string
}


export interface EventDTO {
  id: string
  title: string
  description: string
  location: string
  date: string
  tickets?: TicketDTO[]  // ✅ allow tickets to be embedded
}

export interface BookingDTO {
  id: string
  userId: string
  ticketId: string
  quantity: number
  status: "pending" | "paid"
  paymentIntentId?: string
  clientSecret?: string
}

