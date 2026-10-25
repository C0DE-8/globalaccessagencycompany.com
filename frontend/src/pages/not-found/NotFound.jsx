import { ButtonLink, Eyebrow } from '../../components/shared/Shared'

export default function NotFound({ onNavigate }) { return <main className="section-shell notfound"><div className="big404">404</div><Eyebrow>THIS ROUTE DOESN’T GO ANYWHERE</Eyebrow><h1>We couldn’t find that page.</h1><p>The page may have moved. Let’s get you back on a clear route.</p><ButtonLink to="/" onNavigate={onNavigate}>Return home</ButtonLink></main> }

