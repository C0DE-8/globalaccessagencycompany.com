import { useState } from 'react'

export function AppLink({ to, children, className = '', onNavigate, ...props }) {
  return <a href={to} className={className} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(to)
  }} {...props}>{children}</a>
}

export function BrandSymbol({ className = '' }) {
  return <svg className={className} viewBox="0 0 58 42" role="img" aria-label="Blue globe and package logo" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="21" r="15"/><ellipse cx="18" cy="21" rx="7" ry="15"/><path d="M4 17h28M4 25h28M6 12h24M6 30h24"/><path d="m37 15 9-5 9 5-9 5-9-5Z"/><path d="M37 15v15l9 5 9-5V15M46 20v15M41 18l9-5"/></g></svg>
}

export function Brand({ onNavigate, footer = false }) {
  return <AppLink to="/" onNavigate={onNavigate} className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Global Access Agency Company home"><span className="brand-mark"><BrandSymbol/></span><span>GLOBAL ACCESS<small>AGENCY COMPANY</small></span></AppLink>
}

export function Header({ route, onNavigate }) {
  const [open, setOpen] = useState(false)
  const setMenuOpen = (next) => { setOpen(next); document.body.classList.toggle('nav-open', next) }
  const navigate = (to) => { setMenuOpen(false); onNavigate(to) }
  return <header className="site-header"><Brand onNavigate={navigate}/><button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!open)}><i/><i/></button><nav id="main-nav" className={`main-nav ${open ? 'is-open' : ''}`}><AppLink onNavigate={navigate} to="/" className={route.page === 'home' ? 'active' : ''}>Home</AppLink><AppLink onNavigate={navigate} to="/about" className={route.page === 'about' ? 'active' : ''}>About</AppLink><AppLink onNavigate={navigate} to="/services" className={['services','service'].includes(route.page) ? 'active' : ''}>Services <span>⌄</span></AppLink><AppLink onNavigate={navigate} to="/contact" className={route.page === 'contact' ? 'active' : ''}>Contact</AppLink><AppLink onNavigate={navigate} to="/track" className={`nav-track ${route.page === 'track' ? 'active' : ''}`}>Track a shipment <b>↗</b></AppLink></nav></header>
}

export function Footer({ onNavigate }) {
  return <footer className="site-footer"><div className="section-shell footer-top"><Brand onNavigate={onNavigate} footer/><p>Thoughtful logistics. Stronger connections.</p><AppLink onNavigate={onNavigate} to="/contact">Start a conversation <span>↗</span></AppLink></div><div className="section-shell footer-bottom"><span>© {new Date().getFullYear()} Global Access Agency Company</span><div><AppLink onNavigate={onNavigate} to="/services">Services</AppLink><AppLink onNavigate={onNavigate} to="/track">Track</AppLink><AppLink onNavigate={onNavigate} to="/contact">Contact</AppLink><AppLink onNavigate={onNavigate} to="/gaa-control-7f3c9a/login">Admin access</AppLink></div><a href="#top" className="back-top">BACK TO TOP ↑</a></div></footer>
}

export function ButtonLink({ to, onNavigate, children, outline = false }) {
  return <AppLink to={to} onNavigate={onNavigate} className={`button ${outline ? 'button-outline' : 'button-dark'}`}>{children}<span>↗</span></AppLink>
}

export function Eyebrow({ children, light = false }) { return <div className={`section-kicker ${light ? 'light' : ''}`}>{children}</div> }

export function TrackForm({ onNavigate }) {
  const [number, setNumber] = useState('')
  return <form className="track-form" onSubmit={(event) => { event.preventDefault(); if (number.trim()) onNavigate(`/track?number=${encodeURIComponent(number.trim())}`) }}><label htmlFor="home-tracker">TRACKING NUMBER</label><div className="track-input"><input id="home-tracker" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="e.g. AAE1-12-0000000001" required/><button type="submit" aria-label="Track shipment">→</button></div><small>Have a shipment on the move? We’re here to help.</small></form>
}

export function ServiceCard({ service, onNavigate }) {
  return <AppLink className="service-card reveal" to={`/services/${service.slug}`} onNavigate={onNavigate}><img src={`/images/${service.image}`} alt={service.title}/><span className="service-number">{service.number}</span><div><h3>{service.title}</h3><span className="circle-arrow">↗</span><p>{service.short}</p></div></AppLink>
}

export function PageHero({ onNavigate, title, eyebrow, description, crumbs }) {
  return <section className="page-hero"><div className="section-shell"><div className="breadcrumbs"><AppLink to="/" onNavigate={onNavigate}>Home</AppLink>{crumbs?.map((crumb) => <span key={crumb}> &nbsp; / &nbsp; {crumb}</span>)}</div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div></section>
}


export function CtaBand({ onNavigate, title, eyebrow }) {
  return <section className="tracking-band"><div className="section-shell tracking-inner"><div><Eyebrow light>{eyebrow}</Eyebrow><h2>{title}</h2></div><ButtonLink to="/contact" onNavigate={onNavigate}>Ask our team</ButtonLink></div></section>
}

