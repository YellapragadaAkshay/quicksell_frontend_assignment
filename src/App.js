import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';


const Ticket = ({ ticket }) => (
  <div className={`ticket priority-${ticket.priority}`}>
    <h3>{ticket.title}</h3>
    <p>{ticket.user}</p>
    <p>Status: {ticket.status}</p>
  </div>
);


const App = () => {

  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortingOption, setSortingOption] = useState('priority');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setTickets(response.data.tickets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 


  const groupTickets = () => {
    switch (groupingOption) {
      case 'status':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.status] = [...(acc[ticket.status] || []), ticket];
          return acc;
        }, {});
      case 'user':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.user] = [...(acc[ticket.user] || []), ticket];
          return acc;
        }, {});
      case 'priority':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = [...(acc[ticket.priority] || []), ticket];
          return acc;
        }, {});
      default:
        return {};
    }
  };


  const sortTickets = (groupedTickets) => {
    switch (sortingOption) {
      case 'priority':
        return Object.keys(groupedTickets).sort((a, b) => b - a).map(key => groupedTickets[key]);
      case 'title':
        return Object.keys(groupedTickets).sort().map(key => groupedTickets[key]);
      default:
        return Object.values(groupedTickets);
    }
  };


  const groupedAndSortedTickets = sortTickets(groupTickets());


  return (
    <div className="kanban-board">
      {}
      <div className="display-options">
        <label>
          Group By:
          <select value={groupingOption} onChange={(e) => setGroupingOption(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <label>
          Sort By:
          <select value={sortingOption} onChange={(e) => setSortingOption(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {}
      <div className="tickets">
        {groupedAndSortedTickets.map((group, index) => (
          <div key={index} className="ticket-group">
            {group.map(ticket => (
              <Ticket key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
