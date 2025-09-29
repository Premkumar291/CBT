// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TicketSystem {
    struct Event {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 price;
        uint256 totalTickets;
        uint256 ticketsSold;
        bool isActive;
        uint256 createdAt;
    }

    struct Ticket {
        uint256 eventId;
        uint256 ticketId;
        address owner;
        bool isUsed;
        uint256 purchasedAt;
    }

    uint256 private eventCounter;
    uint256 private ticketCounter;
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => uint256[]) public eventTickets;

    event EventCreated(
        uint256 indexed eventId,
        address indexed creator,
        string name,
        uint256 price,
        uint256 totalTickets
    );

    event TicketPurchased(
        uint256 indexed eventId,
        uint256 indexed ticketId,
        address indexed buyer,
        uint256 price
    );

    event TicketUsed(
        uint256 indexed ticketId,
        address indexed user
    );

    modifier onlyEventCreator(uint256 _eventId) {
        require(events[_eventId].creator == msg.sender, "Only event creator can perform this action");
        _;
    }

    modifier eventExists(uint256 _eventId) {
        require(events[_eventId].id != 0, "Event does not exist");
        _;
    }

    function createEvent(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _totalTickets
    ) external returns (uint256) {
        require(_totalTickets > 0, "Must create at least one ticket");
        require(_price >= 0, "Price cannot be negative");
        
        eventCounter++;
        uint256 eventId = eventCounter;
        
        events[eventId] = Event({
            id: eventId,
            creator: msg.sender,
            name: _name,
            description: _description,
            price: _price,
            totalTickets: _totalTickets,
            ticketsSold: 0,
            isActive: true,
            createdAt: block.timestamp
        });

        emit EventCreated(eventId, msg.sender, _name, _price, _totalTickets);
        return eventId;
    }

    function purchaseTicket(uint256 _eventId) external payable eventExists(_eventId) {
        Event storage event_ = events[_eventId];
        
        require(event_.isActive, "Event is not active");
        require(event_.ticketsSold < event_.totalTickets, "Event is sold out");
        require(msg.value == event_.price, "Incorrect payment amount");
        
        ticketCounter++;
        uint256 ticketId = ticketCounter;
        
        tickets[ticketId] = Ticket({
            eventId: _eventId,
            ticketId: ticketId,
            owner: msg.sender,
            isUsed: false,
            purchasedAt: block.timestamp
        });

        event_.ticketsSold++;
        userTickets[msg.sender].push(ticketId);
        eventTickets[_eventId].push(ticketId);

        // Transfer funds to event creator
        payable(event_.creator).transfer(msg.value);

        emit TicketPurchased(_eventId, ticketId, msg.sender, event_.price);
    }

    function useTicket(uint256 _ticketId) external {
        require(tickets[_ticketId].owner == msg.sender, "Not ticket owner");
        require(!tickets[_ticketId].isUsed, "Ticket already used");
        
        tickets[_ticketId].isUsed = true;
        
        emit TicketUsed(_ticketId, msg.sender);
    }

    function getEvent(uint256 _eventId) external view eventExists(_eventId) returns (
        uint256 id,
        address creator,
        string memory name,
        string memory description,
        uint256 price,
        uint256 totalTickets,
        uint256 ticketsSold,
        bool isActive,
        uint256 createdAt
    ) {
        Event storage event_ = events[_eventId];
        return (
            event_.id,
            event_.creator,
            event_.name,
            event_.description,
            event_.price,
            event_.totalTickets,
            event_.ticketsSold,
            event_.isActive,
            event_.createdAt
        );
    }

    function getTicket(uint256 _ticketId) external view returns (
        uint256 eventId,
        uint256 ticketId,
        address owner,
        bool isUsed,
        uint256 purchasedAt
    ) {
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.ticketId != 0, "Ticket does not exist");
        
        return (
            ticket.eventId,
            ticket.ticketId,
            ticket.owner,
            ticket.isUsed,
            ticket.purchasedAt
        );
    }

    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }

    function getEventTickets(uint256 _eventId) external view eventExists(_eventId) returns (uint256[] memory) {
        return eventTickets[_eventId];
    }

    function toggleEventActive(uint256 _eventId) external onlyEventCreator(_eventId) eventExists(_eventId) {
        events[_eventId].isActive = !events[_eventId].isActive;
    }

    function getEventsCount() external view returns (uint256) {
        return eventCounter;
    }

    function getTicketsCount() external view returns (uint256) {
        return ticketCounter;
    }
}