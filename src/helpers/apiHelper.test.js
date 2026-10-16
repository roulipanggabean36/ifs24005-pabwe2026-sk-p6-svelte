import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest, getToken, setToken, removeToken } from './apiHelper'
import { mockFetchResponse, mockBrokenJsonResponse } from '../test-utils'

describe('apiHelper', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('menyimpan, membaca, dan menghapus token', () => {
    expect(getToken()).toBeNull()
    setToken('abc')
    expect(getToken()).toBe('abc')
    removeToken()
    expect(getToken()).toBeNull()
  })

  it('GET dengan Bearer token', async () => {
    setToken('abc')
    fetch.mockResolvedValue(mockFetchResponse({ status: 'success', data: { a: 1 } }))
    const result = await apiRequest('/users/me')
    expect(result.data.a).toBe(1)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.test/api/v1/users/me',
      expect.objectContaining({ method: 'GET', headers: { Accept: 'application/json', Authorization: 'Bearer abc' } })
    )
  })

  it('tanpa token tidak mengirim Authorization', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 'success' }))
    await apiRequest('/x')
    expect(fetch.mock.calls[0][1].headers).toEqual({ Accept: 'application/json' })
  })

  it('auth=false tidak mengirim Authorization walau token ada', async () => {
    setToken('abc')
    fetch.mockResolvedValue(mockFetchResponse({ status: 'success' }))
    await apiRequest('/auth/login', { method: 'POST', body: { a: 1 }, auth: false })
    expect(fetch.mock.calls[0][1].headers).toEqual({ Accept: 'application/json', 'Content-Type': 'application/json' })
  })

  it('mengirim body JSON', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 'success' }))
    await apiRequest('/x', { method: 'POST', body: { a: 1 } })
    const init = fetch.mock.calls[0][1]
    expect(init.body).toBe(JSON.stringify({ a: 1 }))
    expect(init.headers['Content-Type']).toBe('application/json')
  })

  it('mengirim FormData tanpa Content-Type', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 'success' }))
    const form = new FormData()
    form.append('cover', 'x')
    await apiRequest('/x', { method: 'POST', body: form })
    const init = fetch.mock.calls[0][1]
    expect(init.body).toBe(form)
    expect(init.headers['Content-Type']).toBeUndefined()
  })

  it('melempar pesan dari server saat response tidak ok', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 'fail', message: 'Gagal X' }, { ok: false, status: 400 }))
    await expect(apiRequest('/x')).rejects.toThrow('Gagal X')
  })

  it('melempar pesan fallback saat tidak ada message', async () => {
    fetch.mockResolvedValue(mockFetchResponse({}, { ok: false, status: 500 }))
    await expect(apiRequest('/x')).rejects.toThrow('Permintaan gagal (500)')
  })

  it('melempar saat ok tapi status=fail', async () => {
    fetch.mockResolvedValue(mockFetchResponse({ status: 'fail', message: 'Ditolak' }))
    await expect(apiRequest('/x')).rejects.toThrow('Ditolak')
  })

  it('JSON rusak dengan status ok mengembalikan null', async () => {
    fetch.mockResolvedValue(mockBrokenJsonResponse())
    await expect(apiRequest('/x')).resolves.toBeNull()
  })

  it('JSON rusak dengan status gagal memakai pesan fallback', async () => {
    fetch.mockResolvedValue(mockBrokenJsonResponse({ ok: false, status: 502 }))
    await expect(apiRequest('/x')).rejects.toThrow('Permintaan gagal (502)')
  })
})

describe('apiHelper priority', () => {
  it('request API memakai priority low agar tidak masuk rantai kritis render', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse({ status: 'success' })))
    await apiRequest('/x')
    expect(fetch.mock.calls[0][1].priority).toBe('low')
  })
})