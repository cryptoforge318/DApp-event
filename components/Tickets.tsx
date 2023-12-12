import { BsDot } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import Identicon from 'react-identicons'

const Ticket: React.FC = () => {
  return (
    <main
      className="lg:w-1/3 w-full mx-auto flex justify-start items-center
    flex-col sm:space-x-3 bg-white shadow-md overflow-hidden"
    >
      {Array(5)
        .fill()
        .map((ticket, i) => (
          <div
            className={`flex justify-start items-between space-x-4 w-full p-5 border-b border-gray-200`}
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
                <BsDot size={30} className="text-gray-300" />
                <span className="text-gray-500">25 d</span>
              </div>
            </div>
          </div>
        ))}
    </main>
  )
}

export default Ticket
