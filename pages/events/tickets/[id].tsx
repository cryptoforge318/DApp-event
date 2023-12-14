import BuyTicket from '@/components/BuyTicket'
import Ticket from '@/components/Tickets'
import { getTickets } from '@/services/blockchain'
import { generateTicketData } from '@/utils/fakeData'
import { TicketStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Page: NextPage<{ ticketsData: TicketStruct[] }> = ({ ticketsData }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Head>
        <title>Event X | Tickets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex justify-center items-center flex-col flex-wrap p-6">
        <Ticket tickets={ticketsData} />

        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-2">
          <button
            className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
          >
            Buy Ticket
          </button>

          <Link
            href={'/events/' + id}
            className="bg-[#010125] p-2 rounded-full py-3 px-10
            text-white border hover:bg-transparent hover:text-[#010125]
            hover:border-[#010125] duration-300 transition-all"
          >
            Back
          </Link>
        </div>
      </section>

      <BuyTicket />
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const ticketsData: TicketStruct[] = await getTickets(Number(id))

  return {
    props: {
      ticketsData: JSON.parse(JSON.stringify(ticketsData)),
    },
  }
}
