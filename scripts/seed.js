const { faker } = require('@faker-js/faker')
const { ethers } = require('hardhat')
const fs = require('fs')

const toWei = (num) => ethers.parseEther(num.toString())
const dataCount = 5

const generateEventData = (count) => {
  const events = []

  for (let i = 0; i < count; i++) {
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
      capacity: faker.number.int({ min: 20, max: 40 }),
      ticketCost: faker.number.float({ min: 0.01, max: 0.1 }),
      startsAt: faker.date.future().getTime(),
      endsAt: faker.date.past().getTime(),
      timestamp: faker.date.past().getTime(),
      deleted: faker.datatype.boolean(),
      paidOut: faker.datatype.boolean(),
    }
    events.push(event)
  }

  return events
}

async function createEvent(contract, event) {
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

async function buyTickets(contract, eventId, numberOfTickets) {
  const tx = await contract.buyTickets(eventId, numberOfTickets, { value: toWei(2) })
  await tx.wait()
}

async function getEvents(contract) {
  const result = await contract.getEvents()
  console.log('Events:', result)
}

async function getTickets(contract, eventId) {
  const result = await contract.getTickets(eventId)
  console.log('Tickets:', result)
}

async function main() {
  let dappEventXContract

  try {
    const contractAddresses = fs.readFileSync('./contracts/contractAddress.json', 'utf8')
    const { dappEventXContract: dappEventXAddress } = JSON.parse(contractAddresses)

    dappEventXContract = await ethers.getContractAt('DappEventX', dappEventXAddress)

    // generateEventData(dataCount).forEach(async (event) => {
    //   await createEvent(dappEventXContract, event)
    // })

    // Array(dataCount)
    //   .fill()
    //   .forEach(async (event, i) => {
    //     const randomCount = faker.number.int({ min: 1, max: 4 })

    //     Array(randomCount)
    //       .fill()
    //       .forEach(async (_, j) => {
    //         await buyTickets(dappEventXContract, i + 1, randomCount)
    //       })
    //   })

    // await getEvents(dappEventXContract)
    // await getTickets(dappEventXContract, 1)
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
