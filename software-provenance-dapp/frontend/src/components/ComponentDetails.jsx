import { useState } from "react";
export default function ComponentDetails({contract}) {
 const [id,setId]=useState(""); const [component,setComponent]=useState(null); const [history,setHistory]=useState([]);
 const [action,setAction]=useState(""); const [details,setDetails]=useState(""); const [newOwner,setNewOwner]=useState(""); const [message,setMessage]=useState("");
 const statuses=["Registered","In Development","Tested","Released"];
 async function load(){try{setComponent(await contract.getComponent(id));setHistory(await contract.getProvenanceHistory(id));setMessage("");}catch(e){setComponent(null);setHistory([]);setMessage("Component not found.");}}
 async function add(){try{const tx=await contract.addProvenanceRecord(id,action,details);await tx.wait();setAction("");setDetails("");setMessage("Provenance record added.");await load();}catch(e){setMessage(e.shortMessage||e.reason||"Unable to add record.");}}
 async function transfer(){try{const tx=await contract.transferComponent(id,newOwner);await tx.wait();setNewOwner("");setMessage("Component transferred.");await load();}catch(e){setMessage(e.shortMessage||e.reason||"Transfer failed.");}}
 return <div><div className="card"><h2>Component Details</h2><div className="search-row"><input type="number" value={id} onChange={e=>setId(e.target.value)} placeholder="Component ID"/><button onClick={load}>Search</button></div>{message&&<p className="message">{message}</p>}</div>
 {component&&<><div className="card"><h2>{component.name}</h2><p><b>ID:</b> {Number(component.id)}</p><p><b>Version:</b> {component.version}</p><p className="hash"><b>Owner:</b> {component.owner}</p><p><b>Status:</b> {statuses[Number(component.status)]}</p><p className="hash"><b>Artifact Hash:</b><br/>{component.artifactHash}</p></div>
 <div className="card"><h3>Transfer Component</h3><input value={newOwner} onChange={e=>setNewOwner(e.target.value)} placeholder="Authorised Ethereum address"/><button onClick={transfer}>Transfer</button></div>
 <div className="card"><h3>Add Provenance Event</h3><select value={action} onChange={e=>setAction(e.target.value)}><option value="">Select action</option><option>BUILD_COMPLETED</option><option>SECURITY_TESTED</option><option>APPROVED</option><option>RELEASED</option></select><textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Details"/><button onClick={add}>Add Record</button></div>
 <div className="card"><h3>Provenance History</h3><div className="timeline">{history.map((r,i)=><div className="timeline-item" key={i}><div className="dot"/><div><h4>{r.action}</h4><p>{r.details}</p><small>{r.performedBy}</small><br/><small>{new Date(Number(r.timestamp)*1000).toLocaleString()}</small></div></div>)}</div></div></>}
 </div>;
}
