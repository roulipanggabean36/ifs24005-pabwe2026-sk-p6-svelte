import { apiRequest } from '../../../helpers/apiHelper.js'

export const getUsers = () => apiRequest('/users')

export const getMe = () => apiRequest('/users/me')

export const updateMe = (payload) => apiRequest('/users/me', { method: 'PUT', body: payload })

export const updatePhoto = (file) => {
  const form = new FormData()
  form.append('photo', file)
  return apiRequest('/users/me/photo', { method: 'POST', body: form })
}

export const changePassword = (payload) =>
  apiRequest('/users/password', { method: 'PUT', body: payload })
