import { getEvent, updateEvent } from '@/services/blockchain'
import { timestampToDatetimeLocal } from '@/utils/helper'
import { EventParams, EventStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const Page: NextPage<{ eventData: EventStruct }> = ({ eventData }) => {
  const { address } = useAccount()
  const [event, setEvent] = useState<EventParams>({
    ...eventData,
    startsAt: timestampToDatetimeLocal(eventData.startsAt),
    endsAt: timestampToDatetimeLocal(eventData.endsAt),
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    event.startsAt = new Date(event.startsAt).getTime()
    event.endsAt = new Date(event.endsAt).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        updateEvent(event)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event updated successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div>
      <Head>
        <title>Event X | Edit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-2/3 w-full mx-auto bg-white p-5 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="font-semibold">Edit Event</p>
          </div>

          {event.imageUrl && (
            <div className="flex flex-row justify-center items-center rounded-xl">
              <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20 shadow-md">
                <img src={event.imageUrl} alt={event.title} className="h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              value={event.title}
              onChange={handleChange}
            />
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step={1}
                  min={1}
                  name="capacity"
                  placeholder="Capacity"
                  value={event.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="ticketCost"
                  placeholder="Ticket cost (ETH)"
                  value={event.ticketCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="url"
              name="imageUrl"
              placeholder="ImageURL"
              pattern="https?://.+(\.(jpg|png|gif))?$"
              value={event.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  placeholder="Start Date"
                  className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                  name="startsAt"
                  type="datetime-local"
                  value={event.startsAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  placeholder="End Date"
                  className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                  name="endsAt"
                  type="datetime-local"
                  value={event.endsAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none
              bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              name="description"
              placeholder="Description"
              value={event.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="flex space-x-2 mt-5">
            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Update
            </button>

            <Link
              href={'/events/' + event.id}
              type="button"
              className="bg-transparent p-2 rounded-full py-3 px-5
              text-black hover:bg-orange-500 hover:text-white
              duration-300 transition-all flex justify-start items-center
              space-x-2 border border-black hover:border-orange-500"
            >
              Back
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const eventData: EventStruct = await getEvent(Number(id))

  return {
    props: {
      eventData: JSON.parse(JSON.stringify(eventData)),
    },
  }
}
