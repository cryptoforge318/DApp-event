import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

const EventList: React.FC = () => {
  return (
    <section className="mt-10">
      <main className="lg:w-2/3 w-full mx-auto">
        <h4 className="text-2xl font-semibold mb-4">Recent Events</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(5)
            .fill()
            .map((card, i) => (
              <Card key={i} id={i + 1} />
            ))}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ id: number }> = ({ id }) => {
  return (
    <div className="rounded-lg shadow-lg bg-white max-w-xs">
      <img
        src="https://img.freepik.com/free-vector/business-partners-handshake_74855-5222.jpg?t=st=1661167225~exp=1661167825~hmac=33b5b2e34224ea0dfd65c9f3a054e1e1eb411626fe15e0becbfe343ab31f3ba1"
        alt=""
      />
      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold mb-2 capitalize">Blue ceaser</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi nulla sit libero nemo fuga
          sequi nobis?
        </p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex justify-start items-center">
            <FaEthereum />
            <p className="uppercase text-green-800 font-medium ">0.01 ETH</p>
          </div>

          <Link
            href={'/events/' + id}
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
