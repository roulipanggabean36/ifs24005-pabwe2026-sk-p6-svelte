vi.mock('../features/auth/states/authStore.js', async () => {
  const { writable } = await import('svelte/store')
  return { currentUser: writable(null), logoutUser: vi.fn() }
})
vi.mock('../helpers/navigation.js', () => ({ navigate: vi.fn(), go: vi.fn() }))

import { render, screen, userEvent, waitFor } from '../test-utils.js'
import Navbar from './Navbar.svelte'
import { currentUser, logoutUser } from '../features/auth/states/authStore.js'
import { navigate, go } from '../helpers/navigation.js'

describe('Navbar', () => {
  beforeEach(() => {
    currentUser.set(null)
    logoutUser.mockResolvedValue()
  })

  it('menampilkan nama cadangan saat pengguna belum dimuat', () => {
    render(Navbar, { props: { onToggleSidebar: vi.fn() } })
    expect(screen.getByRole('link', { name: 'Pengguna' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Delcom Link Tree' })).toBeInTheDocument()
  })

  it('menampilkan nama pengguna', () => {
    currentUser.set({ name: 'Rouli' })
    render(Navbar, { props: { onToggleSidebar: vi.fn() } })
    expect(screen.getByRole('link', { name: 'Rouli' })).toBeInTheDocument()
  })

  it('tautan memakai navigasi router', async () => {
    render(Navbar, { props: { onToggleSidebar: vi.fn() } })
    await userEvent.click(screen.getByRole('link', { name: 'Delcom Link Tree' }))
    expect(go).toHaveBeenCalledWith(expect.anything(), '/')
    await userEvent.click(screen.getByRole('link', { name: 'Pengguna' }))
    expect(go).toHaveBeenCalledWith(expect.anything(), '/profile')
  })

  it('tombol menu memanggil onToggleSidebar', async () => {
    const onToggleSidebar = vi.fn()
    render(Navbar, { props: { onToggleSidebar } })
    await userEvent.click(screen.getByRole('button', { name: 'Buka menu' }))
    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('Keluar memanggil logout lalu ke halaman login', async () => {
    render(Navbar, { props: { onToggleSidebar: vi.fn() } })
    await userEvent.click(screen.getByRole('button', { name: 'Keluar' }))
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/auth/login', { replace: true })
    )
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })
})
