import { useState } from 'react'
import { AppLink, BrandSymbol } from '../../../components/shared/Shared'
import { login } from '../../../api/admin/admin'

export default function Login({ onNavigate }) {
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setLoading(true); setNotice('')
    const form = new FormData(event.currentTarget)
    try { await login(form.get('email'), form.get('password')); onNavigate('/gaa-control-7f3c9a') }
    catch (error) { setNotice(error.message || 'Unable to sign in. Check your details and try again.') }
    finally { setLoading(false) }
  }
  return <main className="admin-auth-page"><AppLink to="/" onNavigate={onNavigate} className="admin-auth-back">← Back to website</AppLink><section className="admin-auth-card"><div className="admin-brand-mark large"><BrandSymbol/></div><div className="admin-eyebrow">GLOBAL ACCESS AGENCY COMPANY</div><h1>Admin sign in</h1><p>Manage shipments and keep package updates moving.</p>{notice && <div className="admin-notice error" role="alert">{notice}</div>}<form className="admin-form" onSubmit={submit}><label className="admin-field">Email<input type="email" name="email" autoComplete="username" required placeholder="name@company.com"/></label><label className="admin-field">Password<input type="password" name="password" autoComplete="current-password" required placeholder="Enter your password"/></label><button className="admin-button primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'} <span>→</span></button></form><div className="admin-auth-links"><AppLink to="/gaa-control-7f3c9a/register" onNavigate={onNavigate}>Create admin account</AppLink><AppLink to="/gaa-control-7f3c9a/reset-password" onNavigate={onNavigate}>Reset password</AppLink></div></section><small className="admin-auth-foot">Authorized administrators only</small></main>
}
