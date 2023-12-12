import { faker } from '@faker-js/faker'
import { EventStruct, TicketStruct } from './type.dt'

export const generateEventData = (count: number): EventStruct[] => {
  const events: EventStruct[] = []

  for (let i = 0; i < count; i++) {
    const event: EventStruct = {
      id: i + 1,
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.urlPicsumPhotos(),
      owner: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      sales: faker.number.int({ min: 1, max: 20 }),
      participants: faker.number.int({ min: 20, max: 40 }),
      ticketCost: faker.number.float({ min: 0.01, max: 0.1 }),
      startsAt: faker.date.future().getTime(),
      endsAt: faker.date.past().getTime(),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      paidOut: faker.datatype.boolean(),
    }
    events.push(event)
  }

  return events
}

export const generateTicketData = (count: number): TicketStruct[] => {
  const tickets: TicketStruct[] = []

  for (let i = 0; i < count; i++) {
    const ticket: TicketStruct = {
      id: i,
      eventId: i + 1,
      owner: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      ticketCost: faker.number.float({ min: 0.01, max: 0.1 }),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      refunded: faker.datatype.boolean(),
    }
    tickets.push(ticket)
  }

  return tickets
}
