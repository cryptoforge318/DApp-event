import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import p2eAbi from '@/artifacts/contracts/DappEventX.sol/dappEventX.json'
import { EventStruct, TicketStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.dappEventXContract, p2eAbi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.dappEventXContract, p2eAbi.abi, signer)

    return contracts
  }
}

const getOwner = async (): Promise<string> => {
  const contract = await getEthereumContracts()
  const owner = await contract.owner()
  return owner
}

const getEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getEvents()
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

export { getOwner, getEvents, getEvent, getTickets }
