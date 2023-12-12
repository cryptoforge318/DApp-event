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
