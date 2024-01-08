import { EventStruct, GlobalState, TicketStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setTickets: (states: GlobalState, action: PayloadAction<TicketStruct[]>) => {
    states.tickets = action.payload
  },
  setEvent: (states: GlobalState, action: PayloadAction<EventStruct | null>) => {
    states.event = action.payload
  },
  setTicketModal: (states: GlobalState, action: PayloadAction<string>) => {
    states.ticketModal = action.payload
  },
}
