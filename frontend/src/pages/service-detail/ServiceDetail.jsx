import { ButtonLink, CtaBand, Eyebrow, PageHero } from '../../components/shared/Shared'

export default function ServiceDetail({ service, onNavigate }) {
  return <><PageHero onNavigate={onNavigate} crumbs={['Services', service.title]} eyebrow={`${service.number.split(' / ')[0]} / ${service.title.toUpperCase()}`} title={service.heading} description={service.copy}/><section className="page-content section-shell service-detail reveal"><div><Eyebrow>A CLEARER ROUTE</Eyebrow><h2>{service.title} that fits the journey.</h2><p>{service.detail}</p><ul>{service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><ButtonLink to="/contact" onNavigate={onNavigate}>Discuss {service.title.toLowerCase()}</ButtonLink></div><img src={`/images/${service.image}`} alt={service.title}/></section><CtaBand onNavigate={onNavigate} eyebrow="LET’S PLAN THE NEXT MOVE" title={<>The right route<br/><em>starts here.</em></>}/></>
}
