const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'token'

export const authStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || '',
  save: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('adminEmail'); localStorage.removeItem('adminRole') },
}

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

export async function adminRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && authStore.getToken()) headers.Authorization = `Bearer ${authStore.getToken()}`
  const response = await fetch(`${API_BASE}${path}`, { method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(data.message || data.error || 'Request failed.', response.status)
  return data
}

export async function login(email, password) {
  const data = await adminRequest('/api/auth/login', { method: 'POST', body: { email, password }, auth: false })
  authStore.save(data.token)
  localStorage.setItem('adminEmail', data.user?.email || email)
  localStorage.setItem('adminRole', data.user?.role || 'admin')
  return data.user
}
export async function getProfile() { return (await adminRequest('/api/auth/me')).user }
export async function registerAdmin(values) { return adminRequest('/api/auth/register', { method: 'POST', body: values, auth: false }) }
export async function resetAdminPassword(values) { return adminRequest('/api/auth/reset-password', { method: 'POST', body: values, auth: false }) }
export async function changeAdminPassword(values) { return adminRequest('/api/auth/change-password', { method: 'POST', body: values }) }

export async function listPackages() {
  try {
    const rows = await adminRequest('/api/packages/')
    return Promise.all(rows.map(async (row) => {
      try { return (await adminRequest(`/api/packages/${row.id}`)).package }
      catch { return { ...row, loadError: true } }
    }))
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
export async function getPackageUpdates(tracker) {
  try { return (await adminRequest(`/api/packages/package/${encodeURIComponent(tracker)}/updates`)).updates || [] }
  catch (error) { if (error.status === 404) return []; throw error }
}
export async function getPackage(id) { return (await adminRequest(`/api/packages/${id}`)).package }
export async function createPackage(values) { return adminRequest('/api/packages/create-package', { method: 'POST', body: values }) }
export async function updatePackage(tracker, values) { return adminRequest(`/api/packages/package/${encodeURIComponent(tracker)}`, { method: 'PUT', body: values }) }
export async function addPackageUpdate(tracker, values) { return adminRequest(`/api/packages/package/${encodeURIComponent(tracker)}/update`, { method: 'POST', body: values }) }
export async function deletePackage(tracker) { return adminRequest(`/api/packages/package/${encodeURIComponent(tracker)}`, { method: 'DELETE' }) }
