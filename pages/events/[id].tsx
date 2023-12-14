import BuyTicket from '@/components/BuyTicket'
import Identicon from 'react-identicons'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsDot } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { generateEventData, generateTicketData } from '@/utils/fakeData'
import { EventStruct, TicketStruct } from '@/utils/type.dt'
import { getExpiryDate, truncate } from '@/utils/helper'
import Moment from 'react-moment'
import { getEvent, getTickets } from '@/services/blockchain'

interface ComponentProps {
  eventData: EventStruct
  ticketsData: TicketStruct[]
}

const Page: NextPage<ComponentProps> = ({ eventData, ticketsData }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Head>
        <title>Event X | Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex justify-center items-center flex-col flex-wrap p-6">
        <main
          className="lg:w-2/3 w-full mx-auto flex justify-start items-center
          flex-col sm:space-x-3"
        >
          <div className="sm:w-2/3 w-full shadow-md sm:shadow-sm">
            <img
              src={eventData.imageUrl}
              alt={eventData.title}
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="sm:w-2/3 w-full">
            <h3 className="text-gray-900 text-lg font-bold mb-2 mt-4 capitalize ">
              {eventData.title}
            </h3>
            <p>{eventData.description}</p>

            <div className="flex justify-start items-center my-4 ">
              <div className="flex justify-start items-center">
                <FaEthereum />
                <p className=" font-bold">{eventData.ticketCost.toFixed(2)} ETH </p>
              </div>
              <span className="pl-4">|</span>
              <div className="text-lg mx-4">
                {eventData.startsAt > Date.now() && (
                  <p className="text-gray-600">
                    Starts in {getExpiryDate(eventData.startsAt)} days
                  </p>
                )}

                {Date.now() > eventData.startsAt && (
                  <p className="text-orange-500">Ends in {getExpiryDate(eventData.endsAt)} days</p>
                )}

                {Date.now() > eventData.endsAt && <p className="text-red-500">Expired</p>}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-4 my-8">
              <button
                className="bg-orange-500 p-2 rounded-full py-3 px-10
                text-white hover:bg-transparent border hover:text-orange-500
                hover:border-orange-500 duration-300 transition-all"
              >
                Buy Ticket
              </button>
            </div>

            <h4 className="text-xl mt-10 mb-5">Recent Purchase ({ticketsData.length})</h4>
            {ticketsData.slice(0, 4).map((ticket, i) => (
              <div
                className="flex justify-start items-between space-x-4 w-full py-5 
                border-b border-gray-200"
                key={i}
              >
                <div className="flex justify-start items-center space-x-2">
                  <Identicon
                    className="rounded-full overflow-hidden shadow-md"
                    size={30}
                    string={ticket.owner}
                  />
                  <p className="font-semibold">
                    {truncate({
                      text: ticket.owner,
                      startChars: 4,
                      endChars: 4,
                      maxLength: 11,
                    })}
                  </p>
                </div>

                <div className="flex justify-end items-center w-full">
                  <div className="flex justify-start items-center">
                    <span className="flex items-center">
                      <FaEthereum /> <span>{ticket.ticketCost.toFixed(2)}</span>
                    </span>
                    <BsDot size={30} />
                    <Moment className="text-gray-500" fromNow>
                      {ticket.timestamp}
                    </Moment>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-start items-center space-x-4 my-8">
              <Link
                href={'/events/tickets/' + id}
                className="bg-[#010125] p-2 rounded-full py-3 px-10
                text-white border hover:bg-transparent hover:text-[#010125]
                hover:border-[#010125] duration-300 transition-all"
              >
                All Sales
              </Link>
            </div>
          </div>
        </main>
      </section>

      <BuyTicket />
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const eventData: EventStruct = await getEvent(Number(id))
  const ticketsData: TicketStruct[] = await getTickets(Number(id))

  return {
    props: {
      eventData: JSON.parse(JSON.stringify(eventData)),
      ticketsData: JSON.parse(JSON.stringify(ticketsData)),
    },
  }
}
