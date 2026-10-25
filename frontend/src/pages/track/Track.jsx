import { PageHero } from '../../components/shared/Shared'
import { useEffect, useState } from 'react'
import { trackShipment } from '../../api/shipping'

function ShipmentMap({ shipment, trackerNumber }) {
  const points = [
    { key: 'origin', label: 'Origin', place: shipment.sender_address, lat: shipment.sender_lat, lng: shipment.sender_lng },
    { key: 'current', label: 'Current location', place: shipment.current_location || shipment.location, lat: shipment.current_lat, lng: shipment.current_lng },
    { key: 'destination', label: 'Destination', place: shipment.recipient_address, lat: shipment.recipient_lat, lng: shipment.recipient_lng },
  ].filter((point) => point.place || (Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng))))
  const pins = points.map((point) => ({ ...point, coords: Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng)) ? [Number(point.lat), Number(point.lng)] : null }))
  const mapPoints = pins.filter((point) => point.coords)
  const mapUrl = mapPoints.length
    ? `https://www.openstreetmap.org/?${new URLSearchParams({ bbox: `${Math.min(...mapPoints.map((point) => point.coords[1])) - 1},${Math.min(...mapPoints.map((point) => point.coords[0])) - 1},${Math.max(...mapPoints.map((point) => point.coords[1])) + 1},${Math.max(...mapPoints.map((point) => point.coords[0])) + 1}`, marker: mapPoints.find((point) => point.key === 'current')?.coords.join(',') || mapPoints[0].coords.join(',') })}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(pins.find((point) => point.key === 'current')?.place || pins.at(-1)?.place || '')}`
  const routeLabel = [pins.find((point) => point.key === 'origin')?.place, pins.find((point) => point.key === 'destination')?.place].filter(Boolean).join(' → ')

  return <section className="shipment-map-card" aria-label="Shipment route map">
    <div className="shipment-map-heading"><div><span className="shipment-map-eyebrow">SHIPMENT ROUTE</span><h3>{routeLabel || 'Shipment location'}</h3></div><a href={mapUrl} target="_blank" rel="noreferrer" className="shipment-map-link">Open map ↗</a></div>
    <a className="shipment-map-canvas" href={mapUrl} target="_blank" rel="noreferrer" aria-label={`Open map for shipment ${trackerNumber}`}>
      <div className="shipment-map-grid" aria-hidden="true"/>
      <svg className="shipment-map-route" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><path d="M 80 260 C 240 220, 290 75, 465 145 S 710 285, 920 90"/><path className="shipment-map-route-dash" d="M 80 260 C 240 220, 290 75, 465 145 S 710 285, 920 90"/></svg>
      <span className="shipment-map-watermark">GLOBAL ACCESS <small>SHIPMENT VISIBILITY</small></span>
      {pins.map((point, index) => <span key={point.key} className={`shipment-map-pin ${point.key}`} style={{ left: `${12 + index * (76 / Math.max(pins.length - 1, 1))}%`, top: `${point.key === 'origin' ? '74%' : point.key === 'destination' ? '27%' : '44%'}` }}><i>{point.key === 'origin' ? '1' : point.key === 'destination' ? '3' : '2'}</i><b>{point.label}</b><small>{point.place || 'Coordinates available'}</small></span>)}
      {!pins.length && <span className="shipment-map-empty">Route details will appear here as your shipment is updated.</span>}
      <span className="shipment-map-zoom" aria-hidden="true">＋<br/>−</span>
    </a>
    <div className="shipment-map-foot"><span><i/> Shipment {shipment.status || 'in progress'}</span><span>{mapPoints.length ? 'Map locations based on shipment coordinates' : 'Location view based on shipment records'}</span></div>
  </section>
}

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
  return <><PageHero crumbs={['Track a shipment']} eyebrow="YOUR SHIPMENT, IN VIEW" title={<>A little more clarity<br/><em>along the way.</em></>} description="Enter the tracking number shared by our team to see the latest shipment details."/><section className="page-content section-shell"><form className="track-page-form" onSubmit={submit}><label htmlFor="tracking-page-input">TRACKING NUMBER</label><div className="track-input track-input-light"><input id="tracking-page-input" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="e.g. AAE1-12-0000000001" required/><button type="submit" disabled={loading} aria-label="Find shipment">{loading ? <span className="loading"/> : '→'}</button></div><p className="form-note" role="status" aria-live="polite">{message}</p></form>{shipment && <div className="track-result active"><h2>Shipment {shipment.tracker_number || number}</h2><span className="tracking-status">{String(shipment.status || 'In progress').replaceAll('_',' ')}</span><div className="track-meta">{[['CURRENT LOCATION',shipment.current_location || shipment.location],['DELIVERY DATE',shipment.delivery_date],['SHIPMENT STATUS',shipment.status],['SHIPPED OUT',shipment.shipped_out_date]].map(([label,value]) => <div key={label}><small>{label}</small><strong>{value || 'Updating'}</strong></div>)}</div><ShipmentMap shipment={shipment} trackerNumber={shipment.tracker_number || number}/>{shipment.package_information && <p>{shipment.package_information}</p>}{shipment.updates?.length > 0 && <div className="shipment-updates"><h3>Shipment updates</h3>{shipment.updates.map((update) => <p key={update.id}>{[update.location,update.created_at].filter(Boolean).join(' · ')}: {update.update_message}</p>)}</div>}</div>}</section></>
}
