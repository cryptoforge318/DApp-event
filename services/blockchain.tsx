import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/DappEventX.sol/DappEventX.json'
import { EventParams, EventStruct, TicketStruct } from '@/utils/type.dt'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum
const { setEvent, setTickets } = globalActions

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.dappEventXContract, abi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.dappEventXContract, abi.abi, signer)

    return contracts
  }
}

const createEvent = async (event: EventParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.createEvent(
      event.title,
      event.description,
      event.imageUrl,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt
    )
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateEvent = async (event: EventParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.updateEvent(
      event.id,
      event.title,
      event.description,
      event.imageUrl,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt
    )
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteEvent = async (eventId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteEvent(eventId)
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const payout = async (eventId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.payout(eventId)
    await tx.wait()

    const eventData: EventStruct = await getEvent(eventId)
    store.dispatch(setEvent(eventData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const buyTicket = async (event: EventStruct, tickets: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.buyTickets(event.id, tickets, { value: toWei(tickets * event.ticketCost) })
    await tx.wait()

    const eventData: EventStruct = await getEvent(event.id)
    store.dispatch(setEvent(eventData))

    const ticketsData: TicketStruct[] = await getTickets(event.id)
    store.dispatch(setTickets(ticketsData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getEvents()
  return structuredEvent(events)
}

const getMyEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getMyEvents()
  return structuredEvent(events)
}

const getEvent = async (eventId: number): Promise<EventStruct> => {
  const contract = await getEthereumContracts()
  const event = await contract.getSingleEvent(eventId)
  return structuredEvent([event])[0]
}

const getTickets = async (eventId: number): Promise<TicketStruct[]> => {
  const contract = await getEthereumContracts()
  const tickets = await contract.getTickets(eventId)
  return structuredTicket(tickets)
}

const structuredEvent = (events: EventStruct[]): EventStruct[] =>
  events
    .map((event) => ({
      id: Number(event.id),
      title: event.title,
      imageUrl: event.imageUrl,
      description: event.description,
      owner: event.owner,
      sales: Number(event.sales),
      ticketCost: parseFloat(fromWei(event.ticketCost)),
      capacity: Number(event.capacity),
      seats: Number(event.seats),
      startsAt: Number(event.startsAt),
      endsAt: Number(event.endsAt),
      timestamp: Number(event.timestamp),
      deleted: event.deleted,
      paidOut: event.paidOut,
      refunded: event.refunded,
      minted: event.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredTicket = (tickets: TicketStruct[]): TicketStruct[] =>
  tickets
    .map((ticket) => ({
      id: Number(ticket.id),
      eventId: Number(ticket.eventId),
      owner: ticket.owner,
      ticketCost: parseFloat(fromWei(ticket.ticketCost)),
      timestamp: Number(ticket.timestamp),
      refunded: ticket.refunded,
      minted: ticket.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export {
  getEvents,
  getMyEvents,
  getEvent,
  getTickets,
  createEvent,
  updateEvent,
  deleteEvent,
  buyTicket,
  payout,
}
