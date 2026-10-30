import { AppLink, Eyebrow, PageHero } from '../../components/shared/Shared'
import { services } from '../../data/services'
import { useState } from 'react'

export default function Contact({ onNavigate }) {
  const [sent, setSent] = useState(false)
  function submit(event) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const subject = encodeURIComponent(`Shipping inquiry — ${data.name || 'Website visitor'}`)
    const body = encodeURIComponent(`Name: ${data.name || ''}\nEmail: ${data.email || ''}\nCompany: ${data.company || ''}\nService: ${data.service || ''}\n\n${data.message || ''}`)
    setSent(true)
    window.location.href = `mailto:contact@globalaccessagencycompany.com?subject=${subject}&body=${body}`
  }
  return <><PageHero onNavigate={onNavigate} crumbs={['Contact']} eyebrow="LET’S GET THINGS MOVING" title={<>Tell us what<br/><em>you’re working on.</em></>} description="Share a few details and our team can help you think through the next step."/><section className="page-content section-shell contact-layout"><div><Eyebrow>START A CONVERSATION</Eyebrow><h2>We’re here to help with the details.</h2><p>From a first shipment to a more connected logistics plan, tell us what you need to move and where you need to go.</p><p><strong>Email</strong><br/><a className="text-link" href="mailto:contact@globalaccessagencycompany.com">contact@globalaccessagencycompany.com</a></p><p><strong>Already have a shipment moving?</strong><br/><AppLink to="/track" onNavigate={onNavigate} className="text-link">Track a shipment <span>→</span></AppLink></p></div><form className="contact-form" onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required placeholder="Name"/></label><label>Work email<input name="email" type="email" autoComplete="email" required placeholder="you@company.com"/></label><label>Company<input name="company" autoComplete="organization" placeholder="Company name"/></label><label>What can we help with?<select name="service"><option value="">Select a service</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}<option>Something else</option></select></label><label>A little about your shipment<textarea name="message" required placeholder="Origin, destination, timing, or anything else that would help us understand."/></label><button className="button button-dark" type="submit">Prepare your inquiry <span>↗</span></button><p className="form-note" aria-live="polite">{sent ? 'Your email app is opening with your inquiry.' : 'Submitting opens your email app so you can send your message directly.'}</p></form></section></>
}
