import { useEffect, useState } from "react";
export default function Dashboard({contract, account}) {
  const [count,setCount]=useState(0); const [role,setRole]=useState("None");
  const names=["None","Supplier","Developer","Auditor"];
  useEffect(()=>{(async()=>{if(!contract)return; setCount(Number(await contract.getComponentCount())); setRole(names[Number(await contract.getRole(account))]);})().catch(console.error)},[contract,account]);
  return <><h2>Dashboard</h2><div className="stats">
    <div className="stat-card"><h3>Total Components</h3><strong>{count}</strong></div>
    <div className="stat-card"><h3>Your Role</h3><strong>{role}</strong></div>
    <div className="stat-card"><h3>Network</h3><strong>Ganache</strong></div>
  </div><div className="card"><h3>Connected Account</h3><p className="hash">{account}</p><p>Important component lifecycle events are recorded on the blockchain.</p></div></>;
}
