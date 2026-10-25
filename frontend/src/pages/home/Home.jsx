import { useEffect, useRef, useState } from 'react'
import { AppLink, ButtonLink, Eyebrow, ServiceCard, TrackForm } from '../../components/shared/Shared'
import { services } from '../../data/services'

const heroSlides = [
  { title: <>Our company offers logistics <em>services.</em></>, description: 'A thoughtful logistics partner for every mile, port and possibility.', label: 'LOGISTICS & TRANSPORTATION' },
  { title: <>We transport all around <em>the world.</em></>, description: 'Reliable connections across borders, coastlines and continents.', label: 'FAST AND RELIABLE' },
  { title: <>Safety for every courier and <em>package.</em></>, description: 'Careful handling and clear communication at every handoff.', label: 'PACKAGE SAFETY' },
]

export default function Home({ onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [videoRequested, setVideoRequested] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const heroBackgroundRef = useRef(null)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return undefined
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 6500)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  useEffect(() => {
    const target = heroBackgroundRef.current
    if (!target || !('IntersectionObserver' in window)) {
      const frame = window.requestAnimationFrame(() => setVideoRequested(true))
      return () => window.cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVideoRequested(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoRequested) return undefined
    let player
    let cancelled = false
    const initPlayer = () => {
      if (cancelled || !window.YT?.Player) return
      player = new window.YT.Player('hero-youtube-video', {
        events: {
          onReady: (event) => { event.target.mute(); event.target.playVideo() },
          onStateChange: (event) => setVideoPlaying(event.data === window.YT.PlayerState.PLAYING),
          onError: () => setVideoFailed(true),
        },
      })
    }
    if (window.YT?.Player) initPlayer()
    else {
      const previousReady = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { previousReady?.(); initPlayer() }
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.async = true
        script.onerror = () => setVideoFailed(true)
        document.head.appendChild(script)
      }
    }
    return () => { cancelled = true; player?.destroy() }
  }, [videoRequested])

  return <><section className="hero hero-video-hero">
    <div className="hero-visual hero-background" ref={heroBackgroundRef} aria-hidden="true">
      <div className="hero-fallback" />
      {videoRequested && !videoFailed && <iframe id="hero-youtube-video" className={`hero-video${videoPlaying ? ' is-playing' : ''}`} src="https://www.youtube-nocookie.com/embed/MmOLhcib0jI?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=MmOLhcib0jI&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=0&enablejsapi=1" title="Global Access Agency Company logistics video" allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1} />}
      <div className="hero-video-shade" />
    </div>
    <div className="hero-copy hero-text-slider">
      <div className="eyebrow"><span className="eyebrow-dot"/> {heroSlides[activeSlide].label}</div>
      <div className="hero-copy-slide" key={activeSlide}>
        <h1>{heroSlides[activeSlide].title}</h1>
        <p className="hero-lede">{heroSlides[activeSlide].description}</p>
        <div className="hero-actions"><ButtonLink to="/track" onNavigate={onNavigate}>Track <span>→</span></ButtonLink><AppLink className="text-link" to="/services" onNavigate={onNavigate}>Explore our services <span>→</span></AppLink></div>
      </div>
      <div className="hero-proof"><div className="proof-avatars"><span>G</span><span>A</span><span>+</span></div><p><strong>People-first logistics</strong><br/>Built around your business</p><div className="proof-rule"/><p><strong>One connected network</strong><br/>Across land, air & sea</p></div>
      <div className="hero-text-indicators" aria-label={`Slide ${activeSlide + 1} of ${heroSlides.length}`}>{heroSlides.map((slide,index)=><span key={slide.label} className={index===activeSlide?'active':''}/>)}</div>
    </div>
  </section><section className="trust-strip"><div className="trust-inner"><span>BUILT TO CONNECT</span><div className="trust-line"/><p>Practical expertise. Personal service. A more connected supply chain.</p><div className="trust-marks"><span>01 &nbsp; AIR</span><span>02 &nbsp; OCEAN</span><span>03 &nbsp; LAND</span><span>04 &nbsp; STORAGE</span></div></div></section><section className="intro section-shell reveal"><Eyebrow>A BETTER WAY TO MOVE</Eyebrow><div className="intro-grid"><h2>Complex journeys.<br/><em>Clear next steps.</em></h2><div><p className="body-large">Shipping shouldn’t leave you chasing updates or stitching together providers. We bring the moving parts into one considered plan, with people who stay close from first mile to final handoff.</p><AppLink className="text-link" to="/about" onNavigate={onNavigate}>Meet your logistics partner <span>→</span></AppLink></div></div></section><section className="service-section"><div className="section-shell"><div className="section-heading reveal"><div><Eyebrow>HOW WE GET IT THERE</Eyebrow><h2>Right route. <em>Right on time.</em></h2></div><AppLink className="text-link" to="/services" onNavigate={onNavigate}>All services <span>→</span></AppLink></div><div className="service-grid">{services.filter((s) => ['air-freight','ocean-freight','road-transport','warehousing'].includes(s.slug)).map((service) => <ServiceCard key={service.slug} service={service} onNavigate={onNavigate}/>)}</div><div className="service-foot"><span>Air · Ocean · Road · Rail · Warehousing · Multimodal</span><AppLink to="/services" onNavigate={onNavigate}>Find your route <span>→</span></AppLink></div></div></section><section className="feature-section section-shell"><div className="feature-image reveal"><img src="/images/team-logistics.jpg" alt="Logistics team coordinating shipment details"/><div className="image-stamp"><strong>GAA</strong><small>HERE FOR<br/>THE WHOLE JOURNEY</small></div></div><div className="feature-copy reveal"><Eyebrow>THE HUMAN SIDE OF LOGISTICS</Eyebrow><h2>We don’t just move cargo.<br/><em>We move things forward.</em></h2><p>Good logistics is the quiet confidence that someone has the details covered. Our team listens first, plans carefully and keeps communication open as your shipment travels.</p><div className="feature-points"><div><span>01</span><p><strong>A real person, on your side.</strong><br/>Responsive support from people who know your shipment.</p></div><div><span>02</span><p><strong>Plans built around you.</strong><br/>Routes and service that fit your timing and goals.</p></div><div><span>03</span><p><strong>Clarity at every handoff.</strong><br/>Thoughtful coordination from origin through delivery.</p></div></div><ButtonLink to="/about" onNavigate={onNavigate} outline>More about us</ButtonLink></div></section><section className="tracking-band"><div className="track-orbit orbit-a"/><div className="track-orbit orbit-b"/><div className="section-shell tracking-inner reveal"><div><Eyebrow light>YOUR SHIPMENT, IN VIEW</Eyebrow><h2>Know where it is.<br/><em>Know what’s next.</em></h2><p>Enter your tracking number for the latest shipment details.</p></div><TrackForm onNavigate={onNavigate}/></div></section><section className="closing-cta section-shell reveal"><Eyebrow>READY WHEN YOU ARE</Eyebrow><h2>Let’s get your next<br/><em>shipment moving.</em></h2><ButtonLink to="/contact" onNavigate={onNavigate}>Talk to our team</ButtonLink><span className="cta-orb">G</span></section></>
}
