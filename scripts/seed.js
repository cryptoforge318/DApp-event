const { faker } = require('@faker-js/faker')
const { ethers } = require('hardhat')
const fs = require('fs')

const toWei = (num) => ethers.parseEther(num.toString())
const dataCount = 5
const maxTicketCost = 2

const generateEventData = (count) => {
  const events = []

  for (let i = 0; i < count; i++) {
    const startDate = new Date(Date.now() + 10 * 60 * 1000).getTime()
    const event = {
      id: i + 1,
      title: faker.lorem.words(5),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.urlPicsumPhotos(),
      owner: faker.string.hexadecimal({
        length: { min: 42, max: 42 },
        prefix: '0x',
      }),
      sales: faker.number.int({ min: 1, max: 20 }),
      seats: faker.number.int({ min: 1, max: 20 }),
      capacity: faker.number.int({ min: 20, max: 40 }),
      ticketCost: faker.number.float({ min: 0.01, max: maxTicketCost }),
      startsAt: startDate,
      endsAt: new Date(startDate + 10 * 24 * 60 * 60 * 1000).getTime(),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      paidOut: faker.datatype.boolean(),
      refunded: faker.datatype.boolean(),
      minted: faker.datatype.boolean(),
    }
    events.push(event)
  }

  return events
}

const createEvent = async (contract, event) => {
  const tx = await contract.createEvent(
    event.title,
    event.description,
    event.imageUrl,
    event.capacity,
    toWei(event.ticketCost),
    event.startsAt,
    event.endsAt
  )
  await tx.wait()
}

const buyTickets = async (contract, eventId, numberOfTickets) => {
  const tx = await contract.buyTickets(eventId, numberOfTickets, { value: toWei(maxTicketCost) })
  await tx.wait()
}

const getEvents = async (contract) => {
  const result = await contract.getEvents()
  console.log('Events:', result)
}

const getTickets = async (contract, eventId) => {
  const result = await contract.getTickets(eventId)
  console.log('Tickets:', result)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  let contract

  try {
    const contractAddress = fs.readFileSync('./contracts/contractAddress.json', 'utf8')
    const { dappEventXContract: dappEventXAddress } = JSON.parse(contractAddress)

    contract = await ethers.getContractAt('DappEventX', dappEventXAddress)

    // Process #1
    await Promise.all(
      generateEventData(dataCount).map(async (event) => {
        await createEvent(contract, event)
      })
    )

    await delay(2500) // wait for 2.5 seconds

    // Process #2
    await Promise.all(
      Array(dataCount)
        .fill()
        .map((_, i) => {
          const randomCount = faker.number.int({ min: 1, max: 2 })

          Array(randomCount)
            .fill()
            .map(async () => {
              await buyTickets(contract, i + 1, 1)
            })
        })
    )

    await delay(2500) // wait for 2.5 seconds

    // Process #3
    await getEvents(contract)
    await getTickets(contract, 1)
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
