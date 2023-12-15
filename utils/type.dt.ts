export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

export interface EventParams {
  id?: number
  title: string
  imageUrl: string
  description: string
  ticketCost: number | string
  capacity: number | string
  startsAt: number | string
  endsAt: number | string
}

export interface EventStruct {
  id: number
  title: string
  imageUrl: string
  description: string
  owner: string
  sales: number
  ticketCost: number
  capacity: number
  seats: number
  startsAt: number
  endsAt: number
  timestamp: number
  deleted: boolean
  paidOut: boolean
  refunded: boolean
  minted: boolean
}

export interface TicketStruct {
  id: number
  eventId: number
  owner: string
  ticketCost: number
  timestamp: number
  refunded: boolean
  minted: boolean
}

export interface GlobalState {
  event: EventStruct | null
  tickets: TicketStruct[]
  ticketModal: string
}

export interface RootState {
  globalStates: GlobalState
}
