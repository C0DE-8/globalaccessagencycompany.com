import { useEffect, useState } from 'react'
import { Header, Footer } from './components/shared/Shared'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Services from './pages/services/Services'
import Contact from './pages/contact/Contact'
import Track from './pages/track/Track'
import FAQ from './pages/faq/FAQ'
import NotFound from './pages/not-found/NotFound'
import AirFreight from './pages/air-freight/AirFreight'
import OceanFreight from './pages/ocean-freight/OceanFreight'
import RoadTransport from './pages/road-transport/RoadTransport'
import RailFreight from './pages/rail-freight/RailFreight'
import Warehousing from './pages/warehousing/Warehousing'
import Multimodal from './pages/multimodal/Multimodal'
import AdminLogin from './pages/admin/login/Login'
import AdminRegister from './pages/admin/register/Register'
import AdminResetPassword from './pages/admin/reset-password/ResetPassword'
import AdminDashboard from './pages/admin/dashboard/Dashboard'
import AdminPackages from './pages/admin/packages/Packages'
import AdminCreatePackage from './pages/admin/create-package/CreatePackage'
import AdminUpdatePackage from './pages/admin/update-package/UpdatePackage'
import AdminChangePassword from './pages/admin/change-password/ChangePassword'
import { AdminGate } from './components/admin/AdminLayout'
import './site.css'
import './admin.css'

const routes = {
  '/': { key: 'home', title: 'Global Access Agency Company — Global Freight & Shipping', description: 'Global Access Agency Company coordinates international freight shipping by air, ocean, road and rail, with warehousing and shipment support.', Page: Home },
  '/about': { key: 'about', title: 'About Global Access Agency Company — Shipping Partners', description: 'Meet Global Access Agency Company and learn how our team coordinates clear, reliable freight and logistics journeys worldwide.', Page: About },
  '/services': { key: 'services', title: 'Freight & Logistics Services — Global Access Agency Company', description: 'Explore air freight, ocean freight, road transport, rail freight, warehousing and multimodal shipping services.', Page: Services },
  '/contact': { key: 'contact', title: 'Contact Global Access Agency Company — Request Shipping Help', description: 'Contact Global Access Agency Company to discuss a shipment, freight route, delivery schedule or logistics plan.', Page: Contact },
  '/track': { key: 'track', title: 'Track a Shipment — Global Access Agency Company', description: 'Check the latest available location and status for a shipment handled by Global Access Agency Company.', Page: Track },
  '/faq': { key: 'faq', title: 'Shipping FAQs — Global Access Agency Company', description: 'Answers to common questions about freight services, shipment tracking, quotes and multimodal shipping.', Page: FAQ },
  '/services/air-freight': { key: 'service', title: 'Air Freight Shipping — Global Access Agency Company', description: 'Coordinate international air freight with clear shipment planning and support from Global Access Agency Company.', Page: AirFreight },
  '/services/ocean-freight': { key: 'service', title: 'Ocean Freight Shipping — Global Access Agency Company', description: 'Explore ocean freight shipping options and coordinated cargo support from Global Access Agency Company.', Page: OceanFreight },
  '/services/road-transport': { key: 'service', title: 'Road Freight & Transport — Global Access Agency Company', description: 'Plan domestic and cross-border road freight with shipment coordination from Global Access Agency Company.', Page: RoadTransport },
  '/services/rail-freight': { key: 'service', title: 'Rail Freight Shipping — Global Access Agency Company', description: 'Coordinate rail freight as part of a connected logistics plan with Global Access Agency Company.', Page: RailFreight },
  '/services/warehousing': { key: 'service', title: 'Freight Warehousing — Global Access Agency Company', description: 'Explore warehousing support that connects storage, cargo handling and freight movements.', Page: Warehousing },
  '/services/multimodal': { key: 'service', title: 'Multimodal Freight — Global Access Agency Company', description: 'Combine shipping modes with coordinated multimodal freight planning from Global Access Agency Company.', Page: Multimodal },
  '/gaa-control-7f3c9a/login': { key:'admin-login', title:'Admin sign in — Global Access Agency Company', Page:AdminLogin },
  '/gaa-control-7f3c9a/register': { key:'admin-register', title:'Create admin account — Global Access Agency Company', Page:AdminRegister },
  '/gaa-control-7f3c9a/reset-password': { key:'admin-reset', title:'Reset password — Global Access Agency Company', Page:AdminResetPassword },
  '/gaa-control-7f3c9a': { key:'admin-dashboard', title:'Admin dashboard — Global Access Agency Company', Page:AdminDashboard, protected:true },
  '/gaa-control-7f3c9a/packages': { key:'admin-packages', title:'Packages — Admin', Page:AdminPackages, protected:true },
  '/gaa-control-7f3c9a/packages/new': { key:'admin-create', title:'Create package — Admin', Page:AdminCreatePackage, protected:true },
  '/gaa-control-7f3c9a/packages/update': { key:'admin-update', title:'Update shipment — Admin', Page:AdminUpdatePackage, protected:true },
  '/gaa-control-7f3c9a/change-password': { key:'admin-password', title:'Change password — Admin', Page:AdminChangePassword, protected:true },
}

function resolveRoute(path) {
  const normalized = path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  return routes[normalized] || { key: '404', title: 'Page not found — Global Access Agency Company', Page: NotFound }
}

export default function App() {
  const [location, setLocation] = useState(() => `${window.location.pathname}${window.location.search}`)
  const [transitioning, setTransitioning] = useState(false)
  const url = new URL(location, window.location.origin)
  const route = resolveRoute(url.pathname)
  const Page = route.Page
  const isAdmin = route.key.startsWith('admin-')

  function navigate(to) {
    const next = new URL(to, window.location.origin)
    const nextLocation = `${next.pathname}${next.search}`
    if (nextLocation === location) return
    const update = () => {
      window.history.pushState({}, '', nextLocation)
      setLocation(nextLocation)
      window.scrollTo(0, 0)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return update()
    setTransitioning(true)
    window.setTimeout(() => {
      update()
      window.setTimeout(() => setTransitioning(false), 60)
    }, 170)
  }

  useEffect(() => {
    const back = () => setLocation(`${window.location.pathname}${window.location.search}`)
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [])

  useEffect(() => {
    const description = route.description || 'Global Access Agency Company coordinates freight shipping and logistics support worldwide.'
    const setMeta = (attribute, name, content) => {
      const node = document.querySelector(`meta[${attribute}="${name}"]`)
      if (node) node.setAttribute('content', content)
    }
    document.title = route.title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', route.title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `https://globalaccessagencycompany.com${url.pathname}`)
    setMeta('name', 'twitter:title', route.title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'robots', isAdmin || route.key === '404' ? 'noindex, nofollow' : 'index, follow')
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.href = `https://globalaccessagencycompany.com${url.pathname}`
  }, [route.title, route.description, route.key, isAdmin, url.pathname])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        currentObserver.unobserve(entry.target)
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [location])

  const page = <Page onNavigate={navigate} initialNumber={url.searchParams.get('number')}/>
  return <><div className={`page-wash ${transitioning ? 'exit' : ''}`} aria-hidden="true"/>{!isAdmin && <Header route={{ page: route.key }} onNavigate={navigate}/>}<div key={location} className={transitioning ? 'route-content leaving' : 'route-content'}>{route.protected ? <AdminGate pathname={url.pathname} onNavigate={navigate}>{page}</AdminGate> : page}</div>{!isAdmin && route.key !== '404' && <Footer onNavigate={navigate}/>}</>
}
