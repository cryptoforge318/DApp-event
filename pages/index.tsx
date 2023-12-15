import EventList from '@/components/EventList'
import Hero from '@/components/Hero'
import { getEvents } from '@/services/blockchain'
import { EventStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Page: NextPage<{ eventsData: EventStruct[] }> = ({ eventsData }) => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<EventStruct[]>([])

  useEffect(() => {
    setCollection(eventsData.slice(0, end))
  }, [eventsData, end])

  return (
    <div>
      <Head>
        <title>Event X</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <EventList events={collection} />

      <div className="mt-10 h-20 "></div>

      {collection.length > 0 && eventsData.length > collection.length && (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-orange-500 shadow-md rounded-full py-3 px-4
        text-white duration-300 transition-all"
            onClick={() => setEnd(end + count)}
          >
            {' '}
            Load More
          </button>
        </div>
      )}
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
