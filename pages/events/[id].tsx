import BuyTicket from '@/components/BuyTicket'
import Identicon from 'react-identicons'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsDot } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { generateEventData } from '@/utils/fakeData'
import { EventStruct } from '@/utils/type.dt'
import { getExpiryDate } from '@/utils/helper'
import Image from 'next/image'

const Page: NextPage<{ eventData: EventStruct }> = ({ eventData }) => {
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
            <img src={eventData.imageUrl} alt={eventData.title} className="w-full h-[500px] object-cover" />
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
              <div className=" text-red-500 text-lg font-bold mx-4">
                <p>{getExpiryDate(eventData.startsAt)}</p>
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

            <h4 className="text-xl mt-10 mb-5">Recent Purchase (156)</h4>
            {Array(5)
              .fill()
              .map((ticket, i) => (
                <div
                  className={`flex justify-start items-between space-x-4 w-full p-5 border-b
                  border-gray-200`}
                >
                  <div className="flex justify-start items-center space-x-2">
                    <Identicon
                      className="rounded-full overflow-hidden shadow-md"
                      size={30}
                      string={'account' + i}
                    />
                    <p className="font-semibold">0x70...79C8</p>
                  </div>

                  <div className="flex justify-end items-center w-full">
                    <div className="flex justify-start items-center">
                      <span className="flex items-center">
                        <FaEthereum /> <span>10</span>
                      </span>
                      <BsDot size={30} />
                      <span className="text-gray-500">25 d</span>
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

export const getServerSideProps = async () => {
  const eventData: EventStruct = generateEventData(1)[0]
  return {
    props: { eventData: JSON.parse(JSON.stringify(eventData)) },
  }
}
