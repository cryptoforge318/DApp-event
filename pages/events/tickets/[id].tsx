import BuyTicket from '@/components/BuyTicket'
import Ticket from '@/components/Tickets'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Page: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Head>
        <title>Event X | Tickets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex justify-center items-center flex-col flex-wrap p-6">
        <Ticket />

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
