import { useState } from 'react'
import { AppLink, BrandSymbol } from '../../../components/shared/Shared'
import { AdminNotice } from '../../../components/admin/AdminLayout'
import { registerAdmin } from '../../../api/admin/admin'

export default function Register({ onNavigate }) {
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; setLoading(true); setNotice(null)
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try { await registerAdmin({ adminKey: data.adminKey, email: data.email, password: data.password }); setNotice({type:'success',text:'Admin account created. You can now sign in.'}); form.reset() }
    catch (error) { setNotice({type:'error',text:error.message}) }
    finally { setLoading(false) }
  }
  return <main className="admin-auth-page"><AppLink to="/gaa-control-7f3c9a/login" onNavigate={onNavigate} className="admin-auth-back">← Back to sign in</AppLink><section className="admin-auth-card"><div className="admin-brand-mark large"><BrandSymbol/></div><div className="admin-eyebrow">ADMIN ACCESS</div><h1>Create admin account</h1><p>Enter the admin key provided by your organization.</p>{notice && <AdminNotice notice={notice}/>}<form className="admin-form" onSubmit={submit}><label className="admin-field">Admin key<input type="password" name="adminKey" required/></label><label className="admin-field">Email<input type="email" name="email" autoComplete="email" required/></label><label className="admin-field">Password<input type="password" name="password" minLength="6" autoComplete="new-password" required/></label><button className="admin-button primary" disabled={loading}>{loading?'Creating…':'Create account'} <span>→</span></button></form></section></main>
}
