import Link from 'next/link'
import ConnectBtn from './ConnectBtn'
import React, { useState } from 'react'
import { CgMenuLeft } from 'react-icons/cg'
import { FaTimes } from 'react-icons/fa'

const Header: React.FC = () => {
  return (
    <header className="h-20 shadow-md p-5 sm:px-0 fixed z-50 top-0 right-0 left-0 bg-white">
      <main className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href={'/'} className="text-lg font-bold">
          Event X
        </Link>
        <Desktop />
        <Mobile />
      </main>
    </header>
  )
}

const Desktop: React.FC = () => (
  <div className="hidden sm:flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
    <Link
      href={'/events/create'}
      className="text-md hover:text-orange-500 duration-300 transition-all"
    >
      Create
    </Link>
    <Link
      href={'/events/personal'}
      className="text-md hover:text-orange-500 duration-300 transition-all"
    >
      Personal
    </Link>

    <ConnectBtn networks />
  </div>
)

const Mobile: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="sm:hidden">
      <button onClick={() => setIsOpen(!isOpen)}>
        <CgMenuLeft size={25} />
      </button>
      {isOpen && (
        <div
          className="flex flex-col space-y-4 fixed top-0 right-0 h-full w-64 bg-white
        shadow-md p-4 transition duration-500 ease-in-out transform-all"
        >
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(!isOpen)}>
              <FaTimes size={25} />
            </button>
          </div>

          <Link
            href={'/events/create'}
            className="text-md hover:text-orange-500 duration-300 transition-all block py-1"
          >
            Create
          </Link>

          <Link
            href={'/events/personal'}
            className="text-md hover:text-orange-500 duration-300 transition-all block py-1"
          >
            Personal
          </Link>
          <ConnectBtn />
        </div>
      )}
    </div>
  )
}

export default Header
