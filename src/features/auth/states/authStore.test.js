vi.mock('../api/authApi.js', () => ({ login: vi.fn(), register: vi.fn(), logout: vi.fn() }))
vi.mock('../../users/api/userApi.js', () => ({ getMe: vi.fn() }))

import { get } from 'svelte/store'
import { login, register, logout } from '../api/authApi.js'
import { getMe } from '../../users/api/userApi.js'
import { getToken } from '../../../helpers/apiHelper.js'
import {
  currentUser,
  isLoggedIn,
  loginUser,
  registerUser,
  logoutUser,
  loadCurrentUser
} from './authStore.js'

describe('authStore', () => {
  it('awalnya belum login', () => {
    expect(get(isLoggedIn)).toBe(false)
    expect(get(currentUser)).toBeNull()
  })

  it('loginUser menyimpan token dan menandai login', async () => {
    login.mockResolvedValue({ data: { token: 'tok' } })
    const response = await loginUser({ email: 'a@b.com', password: 'x' })
    expect(login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'x' })
    expect(response.data.token).toBe('tok')
    expect(getToken()).toBe('tok')
    expect(get(isLoggedIn)).toBe(true)
  })

  it('registerUser meneruskan ke API', async () => {
    register.mockResolvedValue({ success: true })
    await expect(registerUser({ name: 'A' })).resolves.toEqual({ success: true })
    expect(register).toHaveBeenCalledWith({ name: 'A' })
  })

  it('loadCurrentUser mengisi store pengguna', async () => {
    getMe.mockResolvedValue({ data: { user: { name: 'Rouli' } } })
    const user = await loadCurrentUser()
    expect(user.name).toBe('Rouli')
    expect(get(currentUser)).toEqual({ name: 'Rouli' })
  })

  it('logoutUser membersihkan token dan pengguna', async () => {
    login.mockResolvedValue({ data: { token: 'tok2' } })
    await loginUser({})
    logout.mockResolvedValue({})
    await logoutUser()
    expect(getToken()).toBeNull()
    expect(get(isLoggedIn)).toBe(false)
    expect(get(currentUser)).toBeNull()
  })
})

describe('authStore logout gagal di server', () => {
  it('tetap membersihkan sesi lokal', async () => {
    login.mockResolvedValue({ data: { token: 'tok3' } })
    await loginUser({})
    logout.mockRejectedValue(new Error('jaringan'))
    await logoutUser()
    expect(getToken()).toBeNull()
    expect(get(isLoggedIn)).toBe(false)
    expect(get(currentUser)).toBeNull()
  })
})