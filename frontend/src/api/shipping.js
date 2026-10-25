const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function get(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'We couldn’t retrieve that shipment.')
    error.status = response.status
    throw error
  }
  return payload
}

export async function trackShipment(number) {
  const trackingNumber = String(number || '').trim()
  if (!trackingNumber) throw new Error('Enter a tracking number to continue.')
  const id = encodeURIComponent(trackingNumber)
  const [result, updateResult] = await Promise.all([
    get(`/api/packages/package/${id}`),
    get(`/api/packages/package/${id}/updates`).catch(() => null),
  ])
  return { ...(result.package || result), updates: updateResult?.updates || [] }
}
