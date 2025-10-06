# Blockchain-Based Voting System

A secure, transparent, and tamper-proof voting system for universities or communities built with React.js and Node.js.

## Features

- **Secure Authentication**: User registration and login with password hashing or MetaMask wallet
- **Role-Based Access**: Admin and voter roles with appropriate permissions
- **Election Management**: Create, activate, and deactivate elections
- **Blockchain Integration**: All votes are recorded on a blockchain for transparency and immutability
- **Vote Verification**: Verify that votes have been recorded correctly on the blockchain
- **Results Display**: View election results after completion
- **MetaMask Integration**: Connect with MetaMask wallet for authentication

## Technology Stack

- **Frontend**: React.js with Bootstrap for UI components
- **Backend**: Node.js with Express.js framework
- **Database**: In-memory storage (can be extended to MongoDB or PostgreSQL)
- **Blockchain**: Custom blockchain implementation for vote recording
- **Authentication**: JWT (JSON Web Tokens) for secure authentication

## Project Structure

```
crypto_app/
├── client/                 # React frontend
│   └── voting-app/         # Main React application
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── services/   # API service files
│       │   └── ...
│       └── ...
└── server/                 # Node.js backend
    ├── controllers/        # Request handlers
    ├── models/             # Data models
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    ├── config/             # Configuration files
    └── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto_app
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client/voting-app
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd client/voting-app
   npm start
   ```
   The frontend will start on http://localhost:3000

### Usage

1. **Register as an Admin**
   - Navigate to the registration page
   - Select "Admin" as your role
   - Complete registration with email/password or MetaMask

2. **Create an Election**
   - Login as an admin
   - Go to "Create Election"
   - Fill in election details and candidates
   - Save the election

3. **Activate the Election**
   - As an admin, go to the election details page
   - Click "Activate Election"

4. **Vote as a Voter**
   - Register as a voter with email/password or MetaMask
   - Login as a voter
   - Navigate to an active election
   - Select a candidate and vote

5. **View Results**
   - After election completion, admins can view results
   - Voters can see results after the election is completed

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user with email/password
- `POST /api/users/login` - Login user with email/password
- `POST /api/users/metamask-register` - Register a new user with MetaMask
- `POST /api/users/metamask-login` - Login user with MetaMask

### Elections
- `POST /api/elections` - Create a new election (Admin only)
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get election by ID
- `PUT /api/elections/:id/activate` - Activate an election (Admin only)
- `PUT /api/elections/:id/deactivate` - Deactivate an election (Admin only)

### Votes
- `POST /api/votes` - Cast a vote
- `GET /api/votes/results/:electionId` - Get election results
- `GET /api/votes/verify/:voteId` - Verify a vote on the blockchain

## Blockchain Implementation

This system implements a simplified blockchain to record votes:

- Each vote is stored as a block in the blockchain
- Blocks contain vote data (election ID, voter ID, candidate, timestamp)
- Each block is cryptographically linked to the previous block
- Vote integrity can be verified by checking the blockchain

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Role-based access control
- Blockchain ensures vote immutability
- Vote verification capabilities

## Future Enhancements

- Integration with Ethereum or other blockchain platforms
- Advanced encryption for voter privacy
- Multi-signature verification for election results
- Mobile application version
- Audit trails for election administrators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.