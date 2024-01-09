//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract DappEventX is Ownable, ReentrancyGuard, ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _totalEvents;
  Counters.Counter private _totalTokens;

  struct EventStruct {
    uint256 id;
    string title;
    string imageUrl;
    string description;
    address owner;
    uint256 sales;
    uint256 ticketCost;
    uint256 capacity;
    uint256 seats;
    uint256 startsAt;
    uint256 endsAt;
    uint256 timestamp;
    bool deleted;
    bool paidOut;
    bool refunded;
    bool minted;
  }

  struct TicketStruct {
    uint256 id;
    uint256 eventId;
    address owner;
    uint256 ticketCost;
    uint256 timestamp;
    bool refunded;
    bool minted;
  }

  uint256 public balance;
  uint256 private servicePct;

  mapping(uint256 => EventStruct) events;
  mapping(uint256 => TicketStruct[]) tickets;
  mapping(uint256 => bool) eventExists;

  constructor(uint256 _pct) ERC721('Event X', 'ETX') {
    servicePct = _pct;
  }

  function createEvent(
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 capacity,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(capacity > 0, 'Capacity must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');

    _totalEvents.increment();
    EventStruct memory eventX;

    eventX.id = _totalEvents.current();
    eventX.title = title;
    eventX.description = description;
    eventX.imageUrl = imageUrl;
    eventX.capacity = capacity;
    eventX.ticketCost = ticketCost;
    eventX.startsAt = startsAt;
    eventX.endsAt = endsAt;
    eventX.owner = msg.sender;
    eventX.timestamp = currentTime();

    eventExists[eventX.id] = true;
    events[eventX.id] = eventX;
  }

  function updateEvent(
    uint256 eventId,
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 capacity,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender, 'Unauthroized entity');
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(capacity > 0, 'Capacity must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');

    EventStruct memory eventX = events[eventId];
    eventX.title = title;
    eventX.description = description;
    eventX.imageUrl = imageUrl;
    eventX.capacity = capacity;
    eventX.ticketCost = ticketCost;
    eventX.startsAt = startsAt;
    eventX.endsAt = endsAt;
    events[eventX.id] = eventX;
  }

  function deleteEvent(uint256 eventId) public nonReentrant {
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthroized entity');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(!events[eventId].refunded, 'Event already refunded');
    require(refundTickets(eventId), 'Event faild to refund');
    events[eventId].deleted = true;
  }

  function getEvents() public view returns (EventStruct[] memory Events) {
    uint256 available;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) available++;
    }

    Events = new EventStruct[](available);

    uint256 index;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) {
        Events[index++] = events[i];
      }
    }
  }

  function getMyEvents() public view returns (EventStruct[] memory Events) {
    uint256 available;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) available++;
    }

    Events = new EventStruct[](available);

    uint256 index;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) {
        Events[index++] = events[i];
      }
    }
  }

  function getSingleEvent(uint256 eventId) public view returns (EventStruct memory) {
    return events[eventId];
  }

  function buyTickets(uint256 eventId, uint256 numOfticket) public payable {
    require(eventExists[eventId], 'Event not found');
    require(numOfticket > 0 && numOfticket <= 3, 'NumOfticket must be (1 - 3)');
    require(msg.value >= numOfticket * events[eventId].ticketCost, 'Insufficient amount');
    require(
      events[eventId].seats + numOfticket <= events[eventId].capacity,
      'Out of seating capacity'
    );

    for (uint i = 0; i < numOfticket; i++) {
      TicketStruct memory ticket;
      ticket.id = tickets[eventId].length;
      ticket.eventId = eventId;
      ticket.owner = msg.sender;
      ticket.ticketCost = events[eventId].ticketCost;
      ticket.timestamp = currentTime();
      tickets[eventId].push(ticket);
    }

    events[eventId].seats += numOfticket;
    balance += msg.value;
  }

  function getTickets(uint256 eventId) public view returns (TicketStruct[] memory) {
    return tickets[eventId];
  }

  function refundTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      tickets[eventId][i].refunded = true;
      balance -= tickets[eventId][i].ticketCost;
      payTo(tickets[eventId][i].owner, tickets[eventId][i].ticketCost);
    }

    events[eventId].refunded = true;
    return true;
  }

  function payout(uint256 eventId) public {
    require(eventExists[eventId], 'Event not found');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(currentTime() > events[eventId].endsAt, 'Event still ongoing'); // disable while testing
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthroized entity');
    require(mintTickets(eventId), "Event failed to mint");

    uint256 revenue = events[eventId].ticketCost * events[eventId].seats;
    uint256 fee = (revenue * servicePct) / 100;

    payTo(events[eventId].owner, revenue - fee);
    payTo(owner(), fee);

    events[eventId].paidOut = true;
    balance -= revenue;
  }

  function mintTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      _totalTokens.increment();
      tickets[eventId][i].minted = true;
      _mint(tickets[eventId][i].owner, _totalTokens.current());
    }

    events[eventId].minted = true;
    return true;
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }

  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }
}
