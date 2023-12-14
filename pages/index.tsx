import EventList from '@/components/EventList'
import Hero from '@/components/Hero'
import { getEvents } from '@/services/blockchain'
import { EventStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage<{ eventsData: EventStruct[] }> = ({ eventsData }) => {
  return (
    <div>
      <Head>
        <title>Event X</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <EventList events={eventsData} />

      <div className="mt-10 h-20 "></div>

      <div className="w-full flex justify-center items-center">
        <button
          className="bg-orange-500 shadow-md rounded-full py-3 px-4
        text-white duration-300 transition-all"
        >
          {' '}
          Load More
        </button>
      </div>
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const eventsData: EventStruct[] = await getEvents()
  return {
    props: { eventsData: JSON.parse(JSON.stringify(eventsData)) },
  }
}
