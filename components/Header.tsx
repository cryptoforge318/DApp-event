import React from 'react'
import ConnectBtn from './ConnectBtn'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <header className="h-20 shadow-md p-5 fixed z-50 top-0 right-0 left-0 bg-white">
      <main className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href={'/'} className="text-lg font-bold">
          DappEventX
        </Link>

        <ConnectBtn />
      </main>
    </header>
  )
}

export default Header
