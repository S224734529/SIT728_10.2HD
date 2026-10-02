# Software Supply Chain Provenance DApp

SIT728 10.2HD starter application using Solidity, Truffle, Ganache, React, ethers.js and MetaMask.

## Features
- Role-based participants: Supplier, Developer and Auditor
- Register software components with a Keccak-256 hash
- Prevent duplicate artifact hashes
- Transfer component ownership to authorised participants
- Add provenance lifecycle events
- View provenance history
- Verify original vs modified component data

## 1. Start Ganache
Use Ganache Desktop/GUI with RPC port 7545.

## 2. Blockchain
```bash
cd blockchain
npm install
npm run compile
npm run test
npm run migrate
```

Copy the deployed contract address printed by Truffle.

## 3. Assign demo roles
```bash
npm run console
```
Then:
```javascript
const c = await SoftwareProvenance.deployed()
const accounts = await web3.eth.getAccounts()
await c.assignRole(accounts[1], 1, {from: accounts[0]}) // Supplier
await c.assignRole(accounts[2], 2, {from: accounts[0]}) // Developer
await c.assignRole(accounts[3], 3, {from: accounts[0]}) // Auditor
```

## 4. Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```
Edit `.env` and set:
```text
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```
Then:
```bash
npm run dev
```

## 5. MetaMask
Add your Ganache network using `http://127.0.0.1:7545` and the Chain ID shown by Ganache. Import a Ganache account using its private key.

## Demo
1. Connect the Supplier account.
2. Register a component, e.g. Authentication Library v2.1.0 with component data `authentication-library-v2.1`.
3. Open Component and search ID 1.
4. Add provenance records.
5. Transfer it to the Developer account.
6. Use Verify with the original component data to get a successful result.
7. Change the component data and verify again to demonstrate modification detection.

## Security work still required for submission
Run a Solidity security scanner such as Slither and document the output. Also document frontend penetration/security tests, including invalid input, unauthorised accounts, wallet disconnection, incorrect hashes, invalid addresses and rejected transactions.
