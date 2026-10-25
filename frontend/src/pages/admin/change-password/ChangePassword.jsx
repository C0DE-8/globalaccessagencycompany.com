import { useState } from 'react'
import { AdminField, AdminNotice, AdminTitle } from '../../../components/gaa-control-7f3c9a/AdminLayout'
import { changeAdminPassword } from '../../../api/gaa-control-7f3c9a/gaa-control-7f3c9a'

export default function ChangePassword() {
  const [notice,setNotice]=useState(null);const [loading,setLoading]=useState(false)
  async function submit(event){event.preventDefault();const form=event.currentTarget;setNotice(null);setLoading(true);const data=Object.fromEntries(new FormData(form));try{await changeAdminPassword({adminKey:data.adminKey,currentPassword:data.currentPassword,newPassword:data.newPassword});setNotice({type:'success',text:'Password updated successfully.'});form.reset()}catch(error){setNotice({type:'error',text:error.message})}finally{setLoading(false)}}
  return <><AdminTitle eyebrow="ACCOUNT SECURITY" title="Change password" description="Confirm your current password and admin key to update your sign-in credentials."/><AdminNotice notice={notice}/><section className="admin-panel admin-form-panel password-panel"><form className="admin-form-grid" onSubmit={submit}><AdminField label="Admin key" name="adminKey" type="password" required/><AdminField label="Current password" name="currentPassword" type="password" autoComplete="current-password" required/><AdminField label="New password" name="newPassword" type="password" minLength="6" autoComplete="new-password" required/><div className="admin-form-actions span-2"><button className="admin-button primary" disabled={loading}>{loading?'Updating…':'Update password'} <span>→</span></button></div></form></section></>
}
