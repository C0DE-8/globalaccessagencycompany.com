import { PageHero } from '../../components/shared/Shared'
import { useEffect, useState } from 'react'
import { trackShipment } from '../../api/shipping'

export default function Tracking({ initialNumber }) {
  const [number, setNumber] = useState(initialNumber || '')
  const [shipment, setShipment] = useState(null)
  const [message, setMessage] = useState('Your shipment details are available with your tracking number.')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event?.preventDefault()
    if (!number.trim()) return
    setLoading(true); setShipment(null); setMessage('Looking up your shipment…')
    try { setShipment(await trackShipment(number)); setMessage('Shipment details updated just now.') }
    catch (error) { setMessage(error.status === 404 ? 'We couldn’t find that tracking number. Check it and try again.' : `${error.message} Check the API connection and try again.`) }
    finally { setLoading(false) }
  }
  useEffect(() => { if (initialNumber) { const timer = window.setTimeout(() => submit(), 0); return () => window.clearTimeout(timer) } }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <><PageHero crumbs={['Track a shipment']} eyebrow="YOUR SHIPMENT, IN VIEW" title={<>A little more clarity<br/><em>along the way.</em></>} description="Enter the tracking number shared by our team to see the latest shipment details."/><section className="page-content section-shell"><form className="track-page-form" onSubmit={submit}><label htmlFor="tracking-page-input">TRACKING NUMBER</label><div className="track-input track-input-light"><input id="tracking-page-input" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="e.g. AAE1-12-0000000001" required/><button type="submit" disabled={loading} aria-label="Find shipment">{loading ? <span className="loading"/> : '→'}</button></div><p className="form-note" role="status" aria-live="polite">{message}</p></form>{shipment && <div className="track-result active"><h2>Shipment {shipment.tracker_number || number}</h2><span className="tracking-status">{String(shipment.status || 'In progress').replaceAll('_',' ')}</span><div className="track-meta">{[['CURRENT LOCATION',shipment.location],['DELIVERY DATE',shipment.delivery_date],['SHIPMENT STATUS',shipment.status],['SHIPPED OUT',shipment.shipped_out_date]].map(([label,value]) => <div key={label}><small>{label}</small><strong>{value || 'Updating'}</strong></div>)}</div>{shipment.package_information && <p>{shipment.package_information}</p>}{shipment.updates?.length > 0 && <div className="shipment-updates"><h3>Shipment updates</h3>{shipment.updates.map((update) => <p key={update.id}>{[update.location,update.created_at].filter(Boolean).join(' · ')}: {update.update_message}</p>)}</div>}</div>}</section></>
}
