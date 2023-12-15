import { EventStruct, GlobalState, TicketStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setTickets: (state: GlobalState, action: PayloadAction<TicketStruct[]>) => {
    state.tickets = action.payload
  },
  setEvent: (state: GlobalState, action: PayloadAction<EventStruct | null>) => {
    state.event = action.payload
  },
  setTicketModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.ticketModal = action.payload
  },
}
