vi.mock('../helpers/navigation.js', async () => {
  const { writable } = await import('svelte/store')
  return { currentPath: writable('/'), go: vi.fn(), navigate: vi.fn() }
})

import { render, screen, userEvent, waitFor } from '../test-utils.js'
import Sidebar from './Sidebar.svelte'
import { currentPath, go } from '../helpers/navigation.js'

const setup = (props = {}) => render(Sidebar, { props: { open: false, onClose: vi.fn(), ...props } })

describe('Sidebar', () => {
  beforeEach(() => {
    currentPath.set('/')
  })

  it('menampilkan menu utama dan menandai Semua Link Tree aktif di beranda', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Semua Link Tree' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Pengguna' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Profil Saya' })).not.toHaveAttribute('aria-current')
  })

  it('Semua Link Tree tetap aktif di halaman detail', async () => {
    setup()
    currentPath.set('/link-trees/1')
    const link = screen.getByRole('link', { name: 'Semua Link Tree' })
    await waitFor(() => expect(link).toHaveAttribute('aria-current', 'page'))
  })

  it('menandai menu lain yang aktif', async () => {
    setup()
    currentPath.set('/users')
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Pengguna' })).toHaveAttribute('aria-current', 'page')
    )
    expect(screen.getByRole('link', { name: 'Semua Link Tree' })).not.toHaveAttribute('aria-current')
  })

  it('kelas geser mengikuti prop open', () => {
    const { unmount } = setup({ open: true })
    expect(screen.getByRole('complementary')).toHaveClass('translate-x-0')
    unmount()
    setup({ open: false })
    expect(screen.getByRole('complementary')).toHaveClass('-translate-x-full')
  })

  it('klik menu memakai router dan menutup sidebar', async () => {
    const onClose = vi.fn()
    setup({ onClose })
    await userEvent.click(screen.getByRole('link', { name: 'Pengguna' }))
    expect(go).toHaveBeenCalledWith(expect.anything(), '/users')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
