import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Wallet, Ticket, Calendar, Users, DollarSign, Hash } from 'lucide-react'
import { ticketSystemABI, CONTRACT_ADDRESS } from './contractABI'
import './index.css'

function App() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [events, setEvents] = useState([])
  const [userTickets, setUserTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Contract configuration
  const contractAddress = CONTRACT_ADDRESS
  const contractABI = ticketSystemABI

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        setLoading(true)
        setError('')
        
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        
        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setAccount(accounts[0])
        
        // Get balance
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
        
        // Load events and tickets
        await loadEvents()
        await loadUserTickets()
        
        setSuccess('Wallet connected successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Please install MetaMask!')
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load all events
  const loadEvents = async () => {
    if (!contract) return
    
    try {
      const eventCount = await contract.getEventsCount()
      const eventsArray = []
      
      for (let i = 1; i <= eventCount; i++) {
        const event = await contract.getEvent(i)
        eventsArray.push({
          id: event[0],
          creator: event[1],
          name: event[2],
          description: event[3],
          price: event[4],
          totalTickets: event[5],
          ticketsSold: event[6],
          isActive: event[7],
          createdAt: new Date(Number(event[8]) * 1000)
        })
      }
      
      setEvents(eventsArray)
    } catch (err) {
      console.error('Error loading events:', err)
    }
  }

  // Load user tickets
  const loadUserTickets = async () => {
    if (!contract || !account) return
    
    try {
      const ticketIds = await contract.getUserTickets(account)
      const ticketsArray = []
      
      for (const ticketId of ticketIds) {
        const ticket = await contract.getTicket(ticketId)
        ticketsArray.push({
          eventId: ticket[0],
          ticketId: ticket[1],
          owner: ticket[2],
          isUsed: ticket[3],
          purchasedAt: new Date(Number(ticket[4]) * 1000)
        })
      }
      
      setUserTickets(ticketsArray)
    } catch (err) {
      console.error('Error loading tickets:', err)
    }
  }

  // Create new event
  const createEvent = async (eventData) => {
    if (!contract) {
      setError('Please connect wallet first')
      return
    }
    
    // Check if contract is deployed (contract address should not be same as user address)
    if (contractAddress.toLowerCase() === account.toLowerCase()) {
      setError('Contract not deployed! Please deploy the smart contract first using Remix IDE')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const tx = await contract.createEvent(
        eventData.name,
        eventData.description,
        ethers.parseEther(eventData.price),
        eventData.totalTickets
      )
      
      await tx.wait()
      await loadEvents()
      
      setSuccess('Event created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to create event: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Purchase ticket
  const purchaseTicket = async (eventId, price) => {
    if (!contract) {
      setError('Please connect wallet first')
      return
    }
    
    // Check if contract is deployed (contract address should not be same as user address)
    if (contractAddress.toLowerCase() === account.toLowerCase()) {
      setError('Contract not deployed! Please deploy the smart contract first using Remix IDE')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const tx = await contract.purchaseTicket(eventId, {
        value: ethers.parseEther(price)
      })
      
      await tx.wait()
      await loadEvents()
      await loadUserTickets()
      
      // Update balance
      const newBalance = await provider.getBalance(account)
      setBalance(ethers.formatEther(newBalance))
      
      setSuccess('Ticket purchased successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to purchase ticket: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Use ticket
  const useTicket = async (ticketId) => {
    if (!contract) {
      setError('Please connect wallet first')
      return
    }
    
    // Check if contract is deployed (contract address should not be same as user address)
    if (contractAddress.toLowerCase() === account.toLowerCase()) {
      setError('Contract not deployed! Please deploy the smart contract first using Remix IDE')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const tx = await contract.useTicket(ticketId)
      await tx.wait()
      await loadUserTickets()
      
      setSuccess('Ticket used successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to use ticket: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          connectWallet()
        } else {
          setAccount('')
          setProvider(null)
          setSigner(null)
          setContract(null)
        }
      })
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>🎫 NFT Ticketing System</h1>
        <p>Create events and purchase NFT tickets on the blockchain</p>
      </header>

      {/* Wallet Section */}
      <section className="wallet-section">
        {!account ? (
          <button 
            className="connect-btn" 
            onClick={connectWallet}
            disabled={loading}
          >
            <Wallet size={20} style={{ marginRight: '10px' }} />
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : (
          <div className="wallet-info">
            <h3>💰 Connected Wallet</h3>
            <div className="wallet-address">
              {account}
            </div>
            <div className="balance">
              Balance: {parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
        )}
      </section>

      {/* Messages */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {/* Contract deployment warning */}
      {account && contractAddress.toLowerCase() === account.toLowerCase() && (
        <div className="warning">
          <strong>Contract Not Deployed!</strong> Please deploy the smart contract using Remix IDE first. 
          Update the CONTRACT_ADDRESS in src/contractABI.js with your deployed contract address.
        </div>
      )}

      {/* Create Event Form */}
      {account && (
        <section className="events-section">
          <h2 className="section-title">
            <Calendar size={24} style={{ marginRight: '10px' }} />
            Create New Event
          </h2>
          
          <CreateEventForm onSubmit={createEvent} loading={loading} />
          
          <h2 className="section-title" style={{ marginTop: '40px' }}>
            <Users size={24} style={{ marginRight: '10px' }} />
            Available Events
          </h2>
          
          <EventsList 
            events={events} 
            onPurchase={purchaseTicket} 
            loading={loading}
          />
        </section>
      )}

      {/* User Tickets */}
      {account && userTickets.length > 0 && (
        <section className="tickets-section">
          <h2 className="section-title">
            <Ticket size={24} style={{ marginRight: '10px' }} />
            My Tickets
          </h2>
          
          <TicketsList 
            tickets={userTickets} 
            onUse={useTicket} 
            loading={loading}
          />
        </section>
      )}
    </div>
  )
}

// Create Event Form Component
function CreateEventForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    totalTickets: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.description && formData.price && formData.totalTickets) {
      onSubmit(formData)
      setFormData({ name: '', description: '', price: '', totalTickets: '' })
    }
  }

  return (
    <form className="create-event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="eventName">Event Name</label>
        <input
          type="text"
          id="eventName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter event name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="eventDescription">Description</label>
        <textarea
          id="eventDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your event"
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="eventPrice">Ticket Price (ETH)</label>
        <input
          type="number"
          id="eventPrice"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="0.01"
          step="0.001"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="totalTickets">Total Tickets</label>
        <input
          type="number"
          id="totalTickets"
          value={formData.totalTickets}
          onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
          placeholder="100"
          min="1"
          required
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}

// Events List Component
function EventsList({ events, onPurchase, loading }) {
  if (events.length === 0) {
    return <div className="loading">No events available. Create one to get started!</div>
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <h3 className="event-name">{event.name}</h3>
          <p className="event-description">{event.description}</p>
          
          <div className="event-details">
            <div className="event-price">
              <DollarSign size={16} />
              {ethers.formatEther(event.price)} ETH
            </div>
            <div className="event-tickets">
              <Ticket size={16} />
              {event.ticketsSold} / {event.totalTickets} sold
            </div>
          </div>

          <button
            className="buy-btn"
            onClick={() => onPurchase(event.id, ethers.formatEther(event.price))}
            disabled={loading || event.ticketsSold >= event.totalTickets || !event.isActive}
          >
            {loading ? 'Processing...' : 
             !event.isActive ? 'Event Closed' :
             event.ticketsSold >= event.totalTickets ? 'Sold Out' : 'Buy Ticket'}
          </button>
        </div>
      ))}
    </div>
  )
}

// Tickets List Component
function TicketsList({ tickets, onUse, loading }) {
  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.ticketId} className={`ticket-card ${ticket.isUsed ? 'ticket-used' : ''}`}>
          <div className="ticket-info">
            <span className="ticket-id">
              <Hash size={14} /> Ticket #{ticket.ticketId}
            </span>
            <span className={`ticket-status ${ticket.isUsed ? 'status-used' : 'status-available'}`}>
              {ticket.isUsed ? 'Used' : 'Available'}
            </span>
          </div>
          
          <p>Event ID: {ticket.eventId}</p>
          <p>Purchased: {ticket.purchasedAt.toLocaleDateString()}</p>
          
          {!ticket.isUsed && (
            <button
              className="use-btn"
              onClick={() => onUse(ticket.ticketId)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Use Ticket'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default App