import { writable } from 'svelte/store'
import { login, register, logout } from '../api/authApi.js'
import { getMe } from '../../users/api/userApi.js'
import { getToken, setToken, removeToken } from '../../../helpers/apiHelper.js'

export const currentUser = writable(null)
export const isLoggedIn = writable(Boolean(getToken()))

export const loginUser = async (payload) => {
  const response = await login(payload)
  setToken(response.data.token)
  isLoggedIn.set(true)
  return response
}

export const registerUser = (payload) => register(payload)

export const logoutUser = async () => {
  try {
    await logout()
  } catch {
    // sesi lokal tetap dibersihkan walau server gagal
  }
  removeToken()
  isLoggedIn.set(false)
  currentUser.set(null)
}

export const loadCurrentUser = async () => {
  const response = await getMe()
  currentUser.set(response.data.user)
  return response.data.user
}
