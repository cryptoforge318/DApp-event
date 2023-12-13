const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe('Contracts', () => {
  let contract, result
  const servicePct = 5
  const eventId = 1
  const title = 'My title'
  const description = 'My First Ever Charity Reminicence'
  const imageUrl = 'https://linktoimage.png'
  const capacity = 10
  const ticketCost = 1.5
  const starts = Date.now() - 10 * 60 * 1000
  const ends = Date.now() + 10 * 60 * 1000
  const numberOfTickets = 1

  beforeEach(async () => {
    ;[deployer, owner, buyer1, buyer2] = await ethers.getSigners()
    contract = await ethers.deployContract('DappEventX', [servicePct])
    await contract.waitForDeployment()
  })

  describe('Events Mgt.', () => {
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createEvent(title, description, imageUrl, capacity, toWei(ticketCost), starts, ends)
    })

    it('should confirm events creation', async () => {
      result = await contract.getEvents()
      expect(result).to.have.lengthOf(1)

      result = await contract.connect(owner).getMyEvents()
      expect(result).to.have.lengthOf(1)
    })

    it('should confirm events update', async () => {
      result = await contract.getSingleEvent(eventId)
      expect(result.title).to.be.equal(title)

      const newTitle = 'My New title'
      await contract
        .connect(owner)
        .updateEvent(
          eventId,
          newTitle,
          description,
          imageUrl,
          capacity,
          toWei(ticketCost),
          starts,
          ends
        )

      result = await contract.getSingleEvent(eventId)
      expect(result.title).to.be.equal(newTitle)
    })

    it('should confirm events deletion', async () => {
      result = await contract.getEvents()
      expect(result).to.have.lengthOf(1)

      result = await contract.getSingleEvent(eventId)
      expect(result.deleted).to.be.equal(false)
      expect(result.refunded).to.be.equal(false)

      await contract.connect(owner).deleteEvent(eventId)

      result = await contract.getEvents()
      expect(result).to.have.lengthOf(0)

      result = await contract.getSingleEvent(eventId)
      expect(result.deleted).to.be.equal(true)
      expect(result.refunded).to.be.equal(true)
    })
  })

  describe('Ticket Mgt.', () => {
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createEvent(title, description, imageUrl, capacity, toWei(ticketCost), starts, ends)

      await contract
        .connect(buyer1)
        .buyTickets(eventId, numberOfTickets, { value: toWei(ticketCost) })
    })

    it('should confirm ticket purchase', async () => {
      result = await contract.getTickets(eventId)
      expect(result).to.have.lengthOf(1)

      result = await contract.balance()
      expect(result).to.be.equal(toWei(ticketCost))

      await contract
        .connect(buyer2)
        .buyTickets(eventId, numberOfTickets, { value: toWei(ticketCost) })

      result = await contract.getTickets(eventId)
      expect(result).to.have.lengthOf(2)

      result = await contract.balance()
      expect(result).to.be.equal(toWei(ticketCost * 2))
    })

    it('should confirm event payout', async () => {
      let balance = await contract.balance()
      expect(balance).to.be.equal(toWei(ticketCost))

      await contract.connect(owner).payout(eventId)

      result = await contract.getSingleEvent(eventId)
      const revenue = Number(fromWei(result.ticketCost)) * Number(result.seats)

      result = await contract.balance()
      expect(result).to.be.equal(fromWei(balance) - revenue)
    })
  })
})
