vi.mock('../../../helpers/apiHelper.js', () => ({ apiRequest: vi.fn() }))

import { apiRequest } from '../../../helpers/apiHelper.js'
import { register, login, logout } from './authApi.js'

describe('authApi', () => {
  beforeEach(() => {
    apiRequest.mockResolvedValue({ success: true })
  })

  it('register memanggil POST /auth/register tanpa token', async () => {
    const payload = { name: 'A', email: 'a@b.com', password: 'x' }
    await register(payload)
    expect(apiRequest).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: payload,
      auth: false
    })
  })

  it('login memanggil POST /auth/login tanpa token', async () => {
    const payload = { email: 'a@b.com', password: 'x' }
    await login(payload)
    expect(apiRequest).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: payload,
      auth: false
    })
  })
})

describe('authApi logout', () => {
  it('logout memanggil POST /auth/logout dengan token', async () => {
    apiRequest.mockResolvedValue({ status: 'success' })
    await logout()
    expect(apiRequest).toHaveBeenCalledWith('/auth/logout', { method: 'POST' })
  })
})