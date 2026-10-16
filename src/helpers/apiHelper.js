const TOKEN_KEY = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

const baseUrl = () => import.meta.env.VITE_DELCOM_BASEURL

export const apiRequest = async (endpoint, { method = 'GET', body, auth = true } = {}) => {
  const headers = { Accept: 'application/json' }
  const isForm = body instanceof FormData

  if (body !== undefined && !isForm) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${baseUrl()}${endpoint}`, {
    method,
    headers,
    priority: 'low',
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body)
  })

  let json = null
  try {
    json = await response.json()
  } catch {
    json = null
  }

  if (!response.ok || (json && json.status === 'fail')) {
    throw new Error(json?.message || `Permintaan gagal (${response.status})`)
  }

  return json
}
