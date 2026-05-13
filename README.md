# Stellar Aqua-Ledger

Regenerative Finance (ReFi) platform on Stellar — tokenized environmental credits tied to physical water infrastructure, powered by Soroban smart contracts.

## Structure

```
stellar-aqua-ledger/
├── contract/   # Soroban smart contract (Rust)
├── backend/    # Node.js/Express API + Stellar SDK
└── frontend/   # React + Vite + Stellar Wallets Kit
```

## Quick Start

### Contract
```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` in `backend/` and `frontend/` and fill in values.
