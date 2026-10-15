import { apiRequest } from '../../../helpers/apiHelper.js'

export const register = (payload) =>
  apiRequest('/auth/register', { method: 'POST', body: payload, auth: false })

export const login = (payload) =>
  apiRequest('/auth/login', { method: 'POST', body: payload, auth: false })

export const logout = () => apiRequest('/auth/logout', { method: 'POST' })