import { useState } from 'react'
import { AppLink, BrandSymbol } from '../../../components/shared/Shared'
import { resetAdminPassword } from '../../../api/admin/admin'

export default function ResetPassword({ onNavigate }) {
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; setLoading(true); setNotice(null)
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try { await resetAdminPassword({ adminKey:data.adminKey,email:data.email,newPassword:data.newPassword }); setNotice({type:'success',text:'Password reset. You can now sign in.'}); form.reset() }
    catch (error) { setNotice({type:'error',text:error.message}) }
    finally { setLoading(false) }
  }
  return <main className="admin-auth-page"><AppLink to="/gaa-control-7f3c9a/login" onNavigate={onNavigate} className="admin-auth-back">← Back to sign in</AppLink><section className="admin-auth-card"><div className="admin-brand-mark large"><BrandSymbol/></div><div className="admin-eyebrow">ACCOUNT RECOVERY</div><h1>Reset password</h1><p>Verify the admin key and email to set a new password.</p>{notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.text}</div>}<form className="admin-form" onSubmit={submit}><label className="admin-field">Admin key<input type="password" name="adminKey" required/></label><label className="admin-field">Admin email<input type="email" name="email" required/></label><label className="admin-field">New password<input type="password" name="newPassword" minLength="6" autoComplete="new-password" required/></label><button className="admin-button primary" disabled={loading}>{loading?'Resetting…':'Reset password'} <span>→</span></button></form></section></main>
}
