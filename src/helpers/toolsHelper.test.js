vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

import Swal from 'sweetalert2'
import { showSuccess, showError, confirmAction, formatDate, resolveImageUrl } from './toolsHelper'

describe('toolsHelper', () => {
  it('showSuccess memanggil Swal ikon success', () => {
    showSuccess('ok')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'ok' }))
  })

  it('showError memanggil Swal ikon error', () => {
    showError('gagal')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', text: 'gagal' }))
  })

  it('confirmAction true saat dikonfirmasi', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true })
    await expect(confirmAction('hapus?')).resolves.toBe(true)
  })

  it('confirmAction false saat dibatalkan', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false })
    await expect(confirmAction('hapus?')).resolves.toBe(false)
  })

  it('formatDate: kosong, tidak valid, dan valid', () => {
    expect(formatDate('')).toBe('-')
    expect(formatDate('bukan-tanggal')).toBe('-')
    expect(formatDate('2025-10-03T00:00:00Z')).toContain('2025')
  })
})

describe('resolveImageUrl', () => {
  it('mengembalikan null untuk kosong atau URL tanpa berkas', () => {
    expect(resolveImageUrl(null)).toBeNull()
    expect(resolveImageUrl('')).toBeNull()
    expect(resolveImageUrl('http://localhost:8000/')).toBeNull()
  })

  it('mengembalikan URL absolut apa adanya', () => {
    expect(resolveImageUrl('http://x.test/a.png')).toBe('http://x.test/a.png')
  })

  it('melengkapi path relatif dengan origin base URL', () => {
    expect(resolveImageUrl('img/profile/1.png')).toBe('https://api.test/img/profile/1.png')
    expect(resolveImageUrl('/img/profile/1.png')).toBe('https://api.test/img/profile/1.png')
  })
})