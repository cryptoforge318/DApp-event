import React from 'react'
import ConnectBtn from './ConnectBtn'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <header className="h-20 shadow-md py-5 fixed z-50 top-0 right-0 left-0 bg-white">
      <main className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href={'/'} className="text-lg font-bold">
          EventX
        </Link>

        <div className="flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
          <Link
            href={'/events/create'}
            className="text-md hover:text-orange-500 duration-300 transition-all"
          >
            Create
          </Link>

          <ConnectBtn />
        </div>
      </main>
    </header>
  )
}

export default Header
