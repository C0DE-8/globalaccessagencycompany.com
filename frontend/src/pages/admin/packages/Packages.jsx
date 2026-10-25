import { useEffect, useMemo, useState } from 'react'
import { AppLink } from '../../../components/shared/Shared'
import { AdminNotice, AdminTitle } from '../../../components/gaa-control-7f3c9a/AdminLayout'
import { PackageTable } from '../dashboard/Dashboard'
import { deletePackage, listPackages } from '../../../api/gaa-control-7f3c9a/gaa-control-7f3c9a'

export default function Packages({ onNavigate }) {
  const [packages,setPackages]=useState([]); const [query,setQuery]=useState(''); const [loading,setLoading]=useState(true); const [notice,setNotice]=useState(null)
  async function load(){setLoading(true);try{setPackages(await listPackages());setNotice(null)}catch(error){setNotice({type:'error',text:error.message})}finally{setLoading(false)}}
  useEffect(()=>{load()},[])
  const shown=useMemo(()=>packages.filter((item)=>`${item.tracker_number} ${item.recipient_name} ${item.sender_name} ${item.location}`.toLowerCase().includes(query.toLowerCase())),[packages,query])
  async function remove(tracker){if(!window.confirm(`Delete package ${tracker}? This cannot be undone.`))return;try{await deletePackage(tracker);setPackages((current)=>current.filter((item)=>item.tracker_number!==tracker));setNotice({type:'success',text:'Package deleted.'})}catch(error){setNotice({type:'error',text:error.message})}}
  return <><AdminTitle eyebrow="SHIPMENT RECORDS" title="Packages" description="Search and manage package records." action={<AppLink to="/gaa-control-7f3c9a/packages/new" onNavigate={onNavigate} className="admin-button primary">＋ Create package</AppLink>}/><AdminNotice notice={notice}/><section className="admin-panel"><div className="admin-panel-head"><div><h2>All packages <span className="admin-count">{loading?'…':shown.length}</span></h2><p>Find a shipment by tracker, recipient or location.</p></div><button className="admin-button secondary" onClick={load}>↻ Refresh</button></div><div className="admin-toolbar"><input aria-label="Search packages" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search shipments…"/><span>Showing {loading?'…':shown.length} of {packages.length}</span></div><PackageTable packages={shown} loading={loading} onNavigate={onNavigate} onDelete={remove}/></section></>
}
