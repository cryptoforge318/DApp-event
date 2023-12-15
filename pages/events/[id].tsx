import Head from 'next/head'
import Link from 'next/link'
import Moment from 'react-moment'
import BuyTicket from '@/components/BuyTicket'
import Identicon from 'react-identicons'
import { GetServerSidePropsContext, NextPage } from 'next'
import { BsDot } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { getEvent, getTickets } from '@/services/blockchain'
import { EventStruct, RootState, TicketStruct } from '@/utils/type.dt'
import { calculateDateDifference, formatDate, getExpiryDate, truncate } from '@/utils/helper'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import EventActions from '@/components/EventAction'

interface ComponentProps {
  eventData: EventStruct
  ticketsData: TicketStruct[]
}

const Page: NextPage<ComponentProps> = ({ eventData, ticketsData }) => {
  const dispatch = useDispatch()
  const { address } = useAccount()

  const { event, tickets } = useSelector((states: RootState) => states.globalStates)
  const { setEvent, setTickets, setTicketModal } = globalActions

  useEffect(() => {
    dispatch(setEvent(eventData))
    dispatch(setTickets(ticketsData))
  }, [dispatch, setEvent, eventData, setTickets, ticketsData])

  return event ? (
    <div>
      <Head>
        <title>Event X | {event.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex justify-center items-center flex-col flex-wrap p-6">
        <main
          className="lg:w-2/3 w-full mx-auto flex justify-start items-center
          flex-col sm:space-x-3"
        >
          <div className="w-full shadow-md sm:shadow-sm">
            <img src={event.imageUrl} alt={event.title} className="w-full h-[500px] object-cover" />
          </div>
          <div className="w-full">
            <div className="flex flex-wrap justify-start items-center space-x-2 mt-4">
              <h3 className="text-gray-900 text-3xl font-bold capitalize ">{event.title}</h3>

              {!event.minted ? (
                <span className="bg-orange-600 text-white rounded-xl px-4">Open</span>
              ) : (
                <span className="bg-cyan-600 text-white rounded-xl px-4">Minted</span>
              )}
            </div>
            <div className="flex justify-start items-center space-x-1 font-medium text-sm">
              {Date.now() < event.endsAt && (
                <>
                  <span>{calculateDateDifference(event.endsAt, Date.now())} remaining</span>
                  <BsDot size={30} />
                </>
              )}
              <span>{event.capacity - event.seats} seat(s) left</span>
            </div>
            <p className="mt-4">{event.description}</p>

            <div className="flex flex-col sm:flex-row justify-start sm:items-center my-4">
              <div className="flex justify-start items-center">
                <FaEthereum />
                <p className=" font-bold">{event.ticketCost.toFixed(2)} ETH </p>
              </div>

              <span className="pl-4 hidden sm:flex">|</span>

              <div className="text-sm sm:text-lg sm:mx-4 mt-2 sm:mt-0">
                {event.startsAt > Date.now() && (
                  <p className="text-gray-600">Starts on {formatDate(event.startsAt)}</p>
                )}

                {Date.now() > event.startsAt && getExpiryDate(event.endsAt) !== 0 && (
                  <p className="text-orange-500">Ends in {getExpiryDate(event.endsAt)} days</p>
                )}

                {Date.now() > event.endsAt && <p className="text-red-500">Expired</p>}
              </div>
            </div>

            <div className="flex justify-start items-center space-x-4 my-8">
              {event.endsAt > Date.now() && (
                <button
                  className="bg-orange-500 p-2 rounded-full py-3 px-10
                text-white hover:bg-transparent border hover:text-orange-500
                hover:border-orange-500 duration-300 transition-all"
                  onClick={() => dispatch(setTicketModal('scale-100'))}
                >
                  Buy Ticket
                </button>
              )}

              {address === event.owner && <EventActions event={event} />}
            </div>

            <h4 className="text-xl mt-10 mb-5">Recent Purchase ({tickets.length})</h4>
            {tickets.slice(0, 4).map((ticket, i) => (
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
                href={'/events/tickets/' + event.id}
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

      <BuyTicket event={event} />
    </div>
  ) : (
    <p>Loading...</p>
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
