vi.mock('./features/linktrees/api/linkTreeApi.js', () => ({
  getLinkTrees: vi.fn(),
  getLinkTree: vi.fn(),
  createLinkTree: vi.fn(),
  updateLinkTree: vi.fn(),
  changeCover: vi.fn(),
  deleteLinkTree: vi.fn(),
  deleteAllLinkTrees: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}))
vi.mock('./features/users/api/userApi.js', () => ({
  getUsers: vi.fn(),
  getMe: vi.fn(),
  updateMe: vi.fn(),
  updatePhoto: vi.fn(),
  changePassword: vi.fn()
}))
vi.mock('./features/auth/api/authApi.js', () => ({
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn()
}))

import { render, screen, waitFor } from './test-utils.js'
import App from './App.svelte'
import { currentPath } from './helpers/navigation.js'
import { isLoggedIn } from './features/auth/states/authStore.js'
import * as linkTreeApi from './features/linktrees/api/linkTreeApi.js'
import * as userApi from './features/users/api/userApi.js'

const tree = {
  id: 2,
  user_id: 1,
  title: 'Kursus Ku',
  type: 'public',
  description: 'Kumpulan kursus',
  cover: 'http://localhost:8000/',
  author: { name: 'Rouli' },
  items: []
}

const visit = (path, loggedIn) => {
  window.history.replaceState({}, '', path)
  currentPath.set(path)
  isLoggedIn.set(loggedIn)
}

describe('App', () => {
  beforeEach(() => {
    linkTreeApi.getLinkTrees.mockResolvedValue({ data: { link_trees: [] } })
    linkTreeApi.getLinkTree.mockResolvedValue({ data: { link_tree: tree } })
    userApi.getMe.mockResolvedValue({
      data: { user: { id: 1, name: 'Rouli', email: 'rouli@del.ac.id', photo: null } }
    })
    userApi.getUsers.mockResolvedValue({ data: { users: [] } })
  })

  it('menampilkan halaman login', async () => {
    visit('/auth/login', false)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Masuk ke akunmu' })).toBeInTheDocument()
  })

  it('menampilkan halaman register', async () => {
    visit('/auth/register', false)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Buat akun baru' })).toBeInTheDocument()
  })

  it('mengarahkan halaman aplikasi ke login bila belum masuk', async () => {
    visit('/', false)
    render(App)
    await waitFor(() => expect(window.location.pathname).toBe('/auth/login'))
    expect(await screen.findByRole('heading', { name: 'Masuk ke akunmu' })).toBeInTheDocument()
  })

  it('mengarahkan halaman login ke beranda bila sudah masuk', async () => {
    visit('/auth/login', true)
    render(App)
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    expect(await screen.findByRole('heading', { name: 'Semua Link Tree' })).toBeInTheDocument()
  })

  it('menampilkan beranda daftar link tree', async () => {
    visit('/', true)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Semua Link Tree' })).toBeInTheDocument()
  })

  it('menampilkan detail link tree', async () => {
    visit('/link-trees/2', true)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Kursus Ku', level: 1 })).toBeInTheDocument()
    expect(linkTreeApi.getLinkTree).toHaveBeenCalledWith('2')
  })

  it('menampilkan halaman pengguna', async () => {
    visit('/users', true)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Pengguna' })).toBeInTheDocument()
  })

  it('menampilkan halaman profil', async () => {
    visit('/profile', true)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Profil Saya' })).toBeInTheDocument()
  })

  it('menampilkan NotFoundPage untuk path lain, masuk atau tidak', async () => {
    visit('/tidak-ada', true)
    const { unmount } = render(App)
    expect(await screen.findByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeInTheDocument()
    unmount()

    visit('/tidak-ada', false)
    render(App)
    expect(await screen.findByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeInTheDocument()
  })

  it('mengikuti tombol back/forward browser (popstate)', async () => {
    visit('/', true)
    render(App)
    await screen.findByRole('heading', { name: 'Semua Link Tree' })

    window.history.pushState({}, '', '/users')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(await screen.findByRole('heading', { name: 'Pengguna' })).toBeInTheDocument()
  })
})
