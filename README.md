# 🌌 ZenoVerse

ZenoVerse is a decentralized application (dApp) that allows users to mint and manage unique digital observations as NFTs on the blockchain. Built with Next.js for the frontend and Solidity smart contracts for the Ethereum blockchain, ZenoVerse provides a seamless experience for creating and managing digital assets.

## 🚀 Features

- **NFT Minting**: Create unique digital observations as NFTs
- **Ownership Tracking**: Easily track ownership of digital assets
- **Metadata Management**: Store and update metadata for each observation
- **Decentralized**: Built on Ethereum blockchain for true ownership
- **Modern Web Interface**: Responsive and intuitive user interface

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Smart Contracts**: OpenZeppelin ERC721 standard
- **Development**: TypeScript, Hardhat Network

## 📦 Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Hardhat
- MetaMask or similar Web3 wallet

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/software-community/ZenoVerse.git
cd ZenoVerse
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install web dependencies
cd web
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# .env
PRIVATE_KEY=your_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

### 4. Compile Smart Contracts

```bash
npx hardhat compile
```

### 5. Run Local Development Network

```bash
npx hardhat node
```

### 6. Deploy Smart Contracts

In a new terminal:

```bash
npx hardhat ignition deploy ./ignition/modules/ZenoVerse.mjs
```

### 7. Start the Development Server

In the web directory:

```bash
cd web
npm run dev
```

Visit `http://localhost:3000` in your browser to see the application.

## 📝 Smart Contracts

The main smart contract `ZenoVerse.sol` implements the ERC721 standard with additional features:

- Mint new observation NFTs
- Update token metadata
- Transfer ownership of tokens
- Burn tokens (admin only)
- Query token ownership and metadata

## 🌐 Frontend

The web interface is built with Next.js and provides:

- Connect wallet functionality
- View owned NFTs
- Mint new observations
- View transaction history

## Available Scripts

### Smart Contract Development

```bash
# Run tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Start local node
npx hardhat node

# Deploy contracts using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/ZenoVerse.mjs

# Get help with Hardhat commands
npx hardhat help
```

### Frontend Development

```bash
# Start development server
cd web
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any inquiries, please open an issue or contact the maintainers.
