vi.mock('../../../helpers/apiHelper.js', () => ({ apiRequest: vi.fn() }))

import { apiRequest } from '../../../helpers/apiHelper.js'
import { getUsers, getMe, updateMe, updatePhoto, changePassword } from './userApi.js'

describe('userApi', () => {
  beforeEach(() => {
    apiRequest.mockResolvedValue({ success: true })
  })

  it('getUsers memanggil GET /users', async () => {
    await getUsers()
    expect(apiRequest).toHaveBeenCalledWith('/users')
  })

  it('getMe memanggil GET /users/me', async () => {
    await getMe()
    expect(apiRequest).toHaveBeenCalledWith('/users/me')
  })

  it('updateMe memanggil PUT /users/me', async () => {
    await updateMe({ name: 'A', email: 'a@b.com' })
    expect(apiRequest).toHaveBeenCalledWith('/users/me', {
      method: 'PUT',
      body: { name: 'A', email: 'a@b.com' }
    })
  })

  it('updatePhoto mengirim FormData dengan field photo', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    await updatePhoto(file)
    const [endpoint, options] = apiRequest.mock.calls[0]
    expect(endpoint).toBe('/users/me/photo')
    expect(options.method).toBe('POST')
    expect(options.body).toBeInstanceOf(FormData)
    expect(options.body.get('photo').name).toBe('a.png')
  })

  it('changePassword memanggil PUT /users/password', async () => {
    await changePassword({ password: 'a', new_password: 'b' })
    expect(apiRequest).toHaveBeenCalledWith('/users/password', {
      method: 'PUT',
      body: { password: 'a', new_password: 'b' }
    })
  })
})
