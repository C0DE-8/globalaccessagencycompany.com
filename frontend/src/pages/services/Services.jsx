import { CtaBand, PageHero, ServiceCard } from '../../components/shared/Shared'
import { services } from '../../data/services'

export default function Services({ onNavigate }) {
  return <><PageHero onNavigate={onNavigate} crumbs={['Services']} eyebrow="CONNECTED SHIPPING SOLUTIONS" title={<>One network.<br/><em>More ways forward.</em></>} description="Choose the right mode for your shipment, or combine them. We’ll help coordinate the details and keep the journey moving."/><section className="page-content section-shell"><div className="service-list">{services.map((service) => <ServiceCard key={service.slug} service={service} onNavigate={onNavigate}/>)}</div></section><CtaBand onNavigate={onNavigate} title={<>Let’s work it<br/><em>out together.</em></>} eyebrow="NOT SURE WHICH ROUTE?"/></>
}
