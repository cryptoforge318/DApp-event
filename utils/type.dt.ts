export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

export interface EventStruct {
  id: number
  title: string
  imageUrl: string
  description: string
  owner: string
  sales: number
  ticketCost: number
  participants: number
  startsAt: number
  endsAt: number
  timestamp: number
  deleted: boolean
  paidOut: boolean
}

export interface TicketStruct {
  id: number
  eventId: number
  owner: string
  ticketCost: number
  timestamp: number
  deleted: boolean
  refunded: boolean
}
