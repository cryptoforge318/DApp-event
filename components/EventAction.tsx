import { Menu } from '@headlessui/react'
import { BsTrash3 } from 'react-icons/bs'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import React from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { EventStruct } from '@/utils/type.dt'
import { GrEdit } from 'react-icons/gr'
import { FiDollarSign } from 'react-icons/fi'
import { deleteEvent, payout } from '@/services/blockchain'
import { useRouter } from 'next/router'

const EventActions: React.FC<{ event: EventStruct }> = ({ event }) => {
  const { address } = useAccount()
  const router = useRouter()

  const handleDelete = async () => {
    if (!address) return toast.warn('Connect wallet first')

    const userConfirmed = window.confirm('Are you sure you want to delete this event?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        deleteEvent(event.id)
          .then((tx) => {
            console.log(tx)
            router.push('/')
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event deleted successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handlePayout = async () => {
    if (!address) return toast.warn('Connect wallet first')

    const userConfirmed = window.confirm('Are you sure you want to payout this event?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        payout(event.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event paidout successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <Menu as="div" className="inline-block text-left text-gray-300 relative">
      <Menu.Button
        className="bg-transparent p-2 rounded-full py-3 px-5
        text-black hover:bg-orange-500 hover:text-white
        duration-300 transition-all flex justify-start items-center
        space-x-2 border border-black hover:border-orange-500"
      >
        <BiDotsVerticalRounded size={17} /> <span>More</span>
      </Menu.Button>
      <Menu.Items
        className="absolute right-0 w-56 origin-top-right
          divide-y divide-gray-300 rounded-md bg-white shadow-md 
          ing-1 ring-gray-300 ring-opacity-5 focus:outline-none"
      >
        {address == event.owner && (
          <>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/events/edit/' + event.id}
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'text-orange-700' : 'text-black'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <GrEdit size={17} />
                  <span>Edit</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-green-700' : 'text-green-700'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handlePayout}
                >
                  <FiDollarSign size={17} />
                  <span>Payout</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-red-700' : 'text-red-700'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleDelete}
                >
                  <BsTrash3 size={17} />
                  <span>Delete</span>
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  )
}

export default EventActions
