import { truncate } from '@/utils/helper'
import { TicketStruct } from '@/utils/type.dt'
import { BsDot } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import Identicon from 'react-identicons'
import Moment from 'react-moment'

const Ticket: React.FC<{ tickets: TicketStruct[] }> = ({ tickets }) => {
  return (
    <main
      className="lg:w-1/3 w-full mx-auto flex justify-start items-center
    flex-col sm:space-x-3 bg-white shadow-md overflow-hidden"
    >
      <h4 className="text-xl mt-10 mb-5">All Purchase ({tickets.length})</h4>
      {tickets.map((ticket, i) => (
        <div
          className="flex justify-start items-between space-x-4 w-full p-5
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
    </main>
  )
}

export default Ticket
