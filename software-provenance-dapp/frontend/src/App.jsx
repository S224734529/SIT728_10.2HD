import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contractABI.json";
import Dashboard from "./components/Dashboard";
import RegisterComponent from "./components/RegisterComponent";
import ComponentDetails from "./components/ComponentDetails";
import VerifyComponent from "./components/VerifyComponent";
import About from "./components/About";
import "./App.css";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [page, setPage] = useState("dashboard");

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask.");
    if (!CONTRACT_ADDRESS) return alert("Set VITE_CONTRACT_ADDRESS in frontend/.env first.");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setAccount(accounts[0]);
    setContract(new ethers.Contract(CONTRACT_ADDRESS, abi, signer));
  }

  useEffect(() => {
    if (!window.ethereum) return;
    const handler = () => connectWallet().catch(console.error);
    window.ethereum.on("accountsChanged", handler);
    window.ethereum.on("chainChanged", handler);
    return () => {
      window.ethereum.removeListener("accountsChanged", handler);
      window.ethereum.removeListener("chainChanged", handler);
    };
  }, []);

  return <div className="app">
    <header><div><h1>Software Provenance</h1><p>Blockchain Software Supply Chain</p></div>
      {!account ? <button onClick={connectWallet}>Connect MetaMask</button> :
      <div className="wallet">{account.slice(0,6)}...{account.slice(-4)}</div>}
    </header>
    <nav>
      {["dashboard","register","component","verify","about"].map(x =>
        <button key={x} onClick={() => setPage(x)}>{x[0].toUpperCase()+x.slice(1)}</button>)}
    </nav>
    <main>
      {!account && <div className="card"><h2>Connect your wallet</h2><p>Connect MetaMask to use the provenance network.</p></div>}
      {account && page==="dashboard" && <Dashboard contract={contract} account={account}/>}
      {account && page==="register" && <RegisterComponent contract={contract}/>}
      {account && page==="component" && <ComponentDetails contract={contract}/>}
      {account && page==="verify" && <VerifyComponent contract={contract}/>}
      {account && page==="about" && <About contract={contract}/>}  
    </main>
  </div>;
}
