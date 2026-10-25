import { useEffect, useState } from 'react'
import { AppLink } from '../../../components/shared/Shared'
import { AdminNotice, AdminTitle } from '../../../components/admin/AdminLayout'
import { listPackages } from '../../../api/admin/admin'

export default function Dashboard({ onNavigate }) {
  const [packages, setPackages] = useState([])
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { listPackages().then(setPackages).catch((error) => setNotice({ type:'error', text:error.message })).finally(() => setLoading(false)) }, [])
  const active = packages.filter((item) => !['delivered','cancelled'].includes(String(item.status).toLowerCase())).length
  const delivered = packages.filter((item) => String(item.status).toLowerCase() === 'delivered').length
  return <><AdminTitle eyebrow="OVERVIEW" title="Shipment dashboard" description="A clear view of the packages moving through your network." action={<AppLink to="/gaa-control-7f3c9a/packages/new" onNavigate={onNavigate} className="admin-button primary">＋ Create package</AppLink>}/><AdminNotice notice={notice}/><div className="admin-stat-grid"><article className="admin-stat"><span>ALL PACKAGES</span><strong>{loading?'—':packages.length}</strong><small>Records in the system</small><i>◈</i></article><article className="admin-stat"><span>IN PROGRESS</span><strong>{loading?'—':active}</strong><small>Not marked delivered</small><i>↗</i></article><article className="admin-stat"><span>DELIVERED</span><strong>{loading?'—':delivered}</strong><small>Completed shipments</small><i>✓</i></article></div><section className="admin-panel"><div className="admin-panel-head"><div><h2>Recent packages</h2><p>Latest shipment records</p></div><AppLink to="/gaa-control-7f3c9a/packages" onNavigate={onNavigate} className="admin-inline-link">View all →</AppLink></div><PackageTable packages={packages.slice(0,6)} loading={loading} onNavigate={onNavigate}/></section><section className="admin-shortcuts"><AppLink to="/gaa-control-7f3c9a/packages/new" onNavigate={onNavigate}><span>＋</span><div><strong>Create a package</strong><small>Start a new shipment record</small></div><b>↗</b></AppLink><AppLink to="/gaa-control-7f3c9a/packages/update" onNavigate={onNavigate}><span>✎</span><div><strong>Update a shipment</strong><small>Change status or add a scan</small></div><b>↗</b></AppLink><AppLink to="/gaa-control-7f3c9a/packages" onNavigate={onNavigate}><span>▤</span><div><strong>View packages</strong><small>Search your shipment list</small></div><b>↗</b></AppLink></section></>
}

export function PackageTable({ packages, loading, onNavigate, onDelete }) {
  if (loading) return <div className="admin-table-skeleton"><i/><i/><i/><i/></div>
  if (!packages.length) return <div className="admin-empty"><span>◈</span><strong>No packages yet</strong><p>Create the first package to see it here.</p></div>
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>TRACKER</th><th>RECIPIENT</th><th>LOCATION</th><th>STATUS</th><th>DELIVERY DATE</th><th/></tr></thead><tbody>{packages.map((pkg)=><tr key={pkg.id || pkg.tracker_number}><td><code>{pkg.tracker_number}</code></td><td>{pkg.recipient_name || '—'}</td><td>{pkg.location || '—'}</td><td><span className={`admin-status status-${String(pkg.status||'hold').toLowerCase().replaceAll('_','-')}`}>{String(pkg.status||'hold').replaceAll('_',' ')}</span></td><td>{pkg.delivery_date ? String(pkg.delivery_date).slice(0,10) : '—'}</td><td className="admin-row-actions"><AppLink to={`/gaa-control-7f3c9a/packages/update?tracker=${encodeURIComponent(pkg.tracker_number)}`} onNavigate={onNavigate}>Edit</AppLink>{onDelete && <button onClick={()=>onDelete(pkg.tracker_number)}>Delete</button>}</td></tr>)}</tbody></table></div>
}
