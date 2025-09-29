# NFT Ticketing System 🎫

A Web3-based NFT ticketing system built with React.js and Solidity. Users can create events, purchase NFT tickets, and manage their ticket collection through MetaMask integration.

## Features

- ✅ Create events with custom pricing and ticket limits
- ✅ Purchase NFT tickets using MetaMask
- ✅ View and manage purchased tickets
- ✅ Use tickets (mark as used)
- ✅ Real-time blockchain integration
- ✅ Responsive design with modern UI

## Tech Stack

- **Frontend**: React.js, Vite, Ethers.js
- **Smart Contract**: Solidity (0.8.19)
- **Wallet**: MetaMask integration
- **Styling**: CSS3 with modern gradients
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- npm or yarn package manager

## Smart Contract Deployment

### Step 1: Compile in Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `TicketSystem.sol`
3. Copy the content from `TicketSystem.sol` in this project
4. Compile the contract (Ctrl+S or Cmd+S)

### Step 2: Deploy to Blockchain

1. Connect MetaMask to your preferred network (Sepolia Testnet recommended for testing)
2. In Remix, go to the "Deploy & Run Transactions" tab
3. Select "Injected Provider - MetaMask" as environment
4. Deploy the contract
5. Copy the deployed contract address

### Step 3: Update Configuration

1. Open `src/contractABI.js`
2. Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with your actual contract address
3. Copy the ABI from Remix (after compilation) and replace the ABI array in `contractABI.js`

## Frontend Setup

### Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

### Configuration

1. Make sure you've updated the contract address and ABI as described above
2. The app is configured to work with Ethereum mainnet and testnets

### Running the Application

```bash
# Start development server
npm run dev

# or with yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage Guide

### For Event Organizers

1. **Connect Wallet**: Click "Connect MetaMask" to connect your wallet
2. **Create Event**: Fill out the event creation form with:
   - Event name
   - Description
   - Ticket price (in ETH)
   - Total tickets available
3. **Manage Events**: Your created events will appear in the "Available Events" section

### For Ticket Buyers

1. **Connect Wallet**: Ensure MetaMask is connected
2. **Browse Events**: View all available events in the marketplace
3. **Purchase Tickets**: Click "Buy Ticket" on any available event
4. **Confirm Transaction**: Approve the transaction in MetaMask
5. **View Tickets**: Your purchased tickets appear in "My Tickets" section
6. **Use Tickets**: Click "Use Ticket" when attending the event

## Smart Contract Functions

### Core Functions
- `createEvent()`: Create a new ticketing event
- `purchaseTicket()`: Purchase a ticket for an event
- `useTicket()`: Mark a ticket as used
- `getEvent()`: Get event details
- `getTicket()`: Get ticket information

### View Functions
- `getUserTickets()`: Get all tickets owned by a user
- `getEventTickets()`: Get all tickets for an event
- `getEventsCount()`: Get total number of events
- `getTicketsCount()`: Get total number of tickets

## Network Configuration

The application is configured for Ethereum networks. To add support for other networks:

1. Update `NETWORK_CONFIG` in `src/contractABI.js`
2. Add network details to MetaMask
3. Ensure the contract is deployed on the target network

### Supported Networks

- Ethereum Mainnet
- Sepolia Testnet (Recommended for testing)
- Goerli Testnet
- Localhost (for development)

## Security Considerations

- Always test with testnet ETH before using mainnet
- Verify contract addresses before transactions
- Use hardware wallets for large transactions
- Keep your private keys secure

## Troubleshooting

### Common Issues

1. **MetaMask Not Found**: Install MetaMask browser extension
2. **Wrong Network**: Switch to supported network in MetaMask
3. **Transaction Failed**: Check gas fees and balance
4. **Contract Not Found**: Verify contract address and ABI

### Development Tips

- Use console logs for debugging Web3 interactions
- Check browser console for error messages
- Verify network connectivity
- Test with small amounts first

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Join our community discussions

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced ticket types (VIP, Early Bird)
- [ ] Royalty system for creators
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Social features

---

Built with ❤️ for the Web3 community