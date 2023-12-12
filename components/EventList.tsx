import { EventStruct } from '@/utils/type.dt'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

const EventList: React.FC<{ events: EventStruct[] }> = ({ events }) => {
  return (
    <section className="mt-10">
      <main className="lg:w-2/3 w-full mx-auto">
        <h4 className="text-2xl font-semibold my-8 text-center">Recent Events</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full justify-items-center">
          {events.map((event, i) => (
            <Card key={i} event={event} />
          ))}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ event: EventStruct }> = ({ event }) => {
  return (
    <div className="rounded-lg shadow-lg bg-white max-w-xs">
      <img src={event.imageUrl} alt={event.title} />

      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold mb-2 capitalize">{event.title}</h3>
        <p>{event.description}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex justify-start items-center">
            <FaEthereum />
            <p className="uppercase text-green-800 font-medium ">
              {event.ticketCost.toFixed(2)} ETH
            </p>
          </div>

          <Link
            href={'/events/' + event.id}
            className="bg-[#010125] shadow-md rounded-full py-1.5 px-3 text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventList
