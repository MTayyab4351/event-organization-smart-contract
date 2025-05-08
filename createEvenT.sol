// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract createEvenT {
    struct Event {
        address organizer;
        string name;
        uint date;
        uint ticketCount;
        uint remaningTicket;
        uint price;
    }

    mapping(uint => Event) public events;
    mapping(address => mapping(uint => uint)) public tickets;
    uint public nextId;

    // Function for create Event
    function createEvents(
        string memory _name,
        uint _date,
        uint _price,
        uint _ticketCount
    ) external {
        require(_date > block.timestamp, "date must be greater");
        require(_price > 0, "price must be greater");
        require(_ticketCount > 0, "ticket count must be greater");

        events[nextId] = Event(
            msg.sender,
            _name,
            _date,
            _ticketCount,
            _ticketCount,
            _price
        );
        nextId++;
    }

    // Function for buy ticket
    function buy(uint _id, uint _quantity) public payable {
        require(events[_id].date != 0, "event does not exist");
        require(_quantity <= events[_id].remaningTicket, "no more ticket available");
        require(events[_id].date > block.timestamp, "event has already happened");
        require(msg.value >= events[_id].price * _quantity, "not enough money");

        events[_id].remaningTicket -= _quantity;
        tickets[msg.sender][_id] += _quantity;
    }
}
