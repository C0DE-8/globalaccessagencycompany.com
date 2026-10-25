import { useEffect, useState } from 'react'
import { AppLink } from '../shared/Shared'
import { authStore, getProfile } from '../../api/gaa-control-7f3c9a/gaa-control-7f3c9a'

export function AdminGate({ children, onNavigate, pathname }) {
  const [state, setState] = useState({ loading: true, user: null })
  useEffect(() => {
    if (!authStore.getToken()) { onNavigate('/gaa-control-7f3c9a/login'); return }
    getProfile().then((user) => setState({ loading: false, user }))
      .catch(() => { authStore.clear(); onNavigate('/gaa-control-7f3c9a/login') })
  }, []) // session check runs once when entering an admin page.
  if (state.loading || !state.user) return <main className="admin-loading"><span className="loading dark"/> Checking admin session…</main>
  return <AdminLayout user={state.user} onNavigate={onNavigate} pathname={pathname}>{children}</AdminLayout>
}

export function AdminLayout({ user, onNavigate, pathname, children }) {
  function logout() { authStore.clear(); onNavigate('/gaa-control-7f3c9a/login') }
  const links = [['/gaa-control-7f3c9a','Overview'],['/gaa-control-7f3c9a/packages','Packages'],['/gaa-control-7f3c9a/packages/new','Create package'],['/gaa-control-7f3c9a/packages/update','Update shipment'],['/gaa-control-7f3c9a/change-password','Password']]
  return <div className="admin-app"><aside className="admin-sidebar"><AppLink to="/gaa-control-7f3c9a" onNavigate={onNavigate} className="admin-brand"><span className="admin-brand-mark">GA</span><span>GLOBAL ACCESS<small>ADMIN WORKSPACE</small></span></AppLink><div className="admin-nav-label">WORKSPACE</div><nav className="admin-nav">{links.map(([to,label])=><AppLink key={to} to={to} onNavigate={onNavigate} className={`admin-nav-link ${pathname===to || (to==='/gaa-control-7f3c9a/packages' && pathname.startsWith('/gaa-control-7f3c9a/packages/') && pathname!=='/gaa-control-7f3c9a/packages/new' && pathname!=='/gaa-control-7f3c9a/packages/update')?'active':''}`}><span className="admin-nav-dot"/>{label}</AppLink>)}</nav><div className="admin-sidebar-bottom"><div className="admin-user"><span className="admin-avatar">{user.email?.slice(0,1).toUpperCase() || 'A'}</span><span><strong>{user.email}</strong><small>{user.role || 'admin'}</small></span></div><button className="admin-logout" onClick={logout}>↗ &nbsp; Sign out</button><AppLink to="/" onNavigate={onNavigate} className="admin-back-site">← Back to website</AppLink></div></aside><div className="admin-main"><header className="admin-topbar"><div><span className="admin-topbar-dot"/> Admin workspace</div><span>{new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date())}</span></header><main className="admin-content">{children}</main></div></div>
}

export function AdminTitle({ eyebrow='ADMINISTRATION', title, description, action }) {
  return <div className="admin-page-title"><div><div className="admin-eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

export function AdminNotice({ notice }) {
  if (!notice?.text) return null
  return <div className={`admin-notice ${notice.type || 'info'}`} role="status">{notice.text}</div>
}

export function AdminField({ label, className='', as, children, ...inputProps }) {
  const control = as === 'textarea' ? <textarea {...inputProps}/> : as === 'select' ? <select {...inputProps}>{children}</select> : <input {...inputProps}/>
  return <label className={`admin-field ${className}`}>{label}{control}</label>
}
