import React from 'react'
import { FaTimes } from 'react-icons/fa'

const BuyTicket: React.FC = () => {
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
        bg-black bg-opacity-50 transform z-50 transition-transform duration-300 scale-0`}
    >
      <div className="bg-white text-black shadow-md shadow-orange-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Buy Tickets</p>
            <button className="border-0 bg-transparent focus:outline-none">
              <FaTimes />
            </button>
          </div>

          <form className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5">
            <div className="py-2 w-full border border-black rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm
                border-none focus:outline-none focus:ring-0 py-0"
                name="tickets"
                placeholder="E.g 2"
                type="number"
                step={1}
                min={1}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Buy Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyTicket
