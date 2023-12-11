import { NextPage } from 'next'
import Head from 'next/head'

const Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Event X | Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-1/3 w-full mx-auto bg-white p-5 shadow-md">
        <form className="flex flex-col text-black">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Create Event</p>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20 shadow-md">
              <img
                src="https://img.freepik.com/free-vector/business-partners-handshake_74855-5222.jpg?t=st=1661167225~exp=1661167825~hmac=33b5b2e34224ea0dfd65c9f3a054e1e1eb411626fe15e0becbfe343ab31f3ba1"
                alt=""
                className="h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="url"
              name="imageURL"
              placeholder="ImageURL"
              required
              pattern=".*\.(jpg|png|gif)$"
            />
          </div>

          <div
            className="flex flex-row justify-between items-center
              bg-gray-200 rounded-xl mt-5 p-2"
          >
            <input
              className="block w-full text-sm bg-transparent
                border-0 focus:outline-none focus:ring-0"
              type="number"
              step="0.01"
              min="0.01"
              name="price"
              placeholder="Price (Eth)"
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none
                bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              name="description"
              placeholder="Description"
              required
            ></textarea>
          </div>

          <div className='mt-5'>
            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page
