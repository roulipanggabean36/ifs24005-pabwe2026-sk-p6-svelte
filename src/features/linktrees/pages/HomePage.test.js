vi.mock('../api/linkTreeApi.js', () => ({
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
vi.mock('../../../helpers/toolsHelper.js', async (importOriginal) => ({
  ...(await importOriginal()),
  showError: vi.fn(),
  showSuccess: vi.fn(),
  confirmAction: vi.fn()
}))

import { render, screen, waitFor, within, userEvent } from '../../../test-utils.js'
import HomePage from './HomePage.svelte'
import * as api from '../api/linkTreeApi.js'
import { linkTrees } from '../states/linkTreesStore.js'
import { showError, showSuccess, confirmAction } from '../../../helpers/toolsHelper.js'
import { currentUser } from '../../auth/states/authStore.js'

const trees = [
  {
    id: 1,
    user_id: 1,
    title: 'Kursus Ku',
    type: 'public',
    description: 'Kumpulan kursus',
    cover: 'http://x.test/c.png',
    author: { name: 'Rouli' },
    total_links: 3
  },
  {
    id: 2,
    user_id: 2,
    title: 'Referensi',
    type: 'private',
    description: null,
    cover: 'http://localhost:8000/',
    author: { name: 'Budi' },
    total_links: 1
  },
  {
    id: 3,
    user_id: 1,
    title: 'Tools',
    type: 'unlisted',
    description: 'Alat',
    cover: 'img/c/3.png',
    author: { name: 'Rouli' },
    total_links: 0
  }
]

const deferred = () => {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const renderLoaded = async () => {
  render(HomePage)
  await screen.findByText('Kursus Ku')
}

const enableOnlyMine = async () => {
  api.getLinkTrees.mockResolvedValue({ data: { link_trees: [trees[0], trees[2]] } })
  await userEvent.click(screen.getByLabelText('Milik saya'))
  return screen.findByRole('button', { name: 'Hapus Semua' })
}

describe('HomePage', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    linkTrees.set([])
    currentUser.set({ id: 1, name: 'Rouli' })
    api.getLinkTrees.mockResolvedValue({ data: { link_trees: trees } })
    api.createLinkTree.mockResolvedValue({ data: { link_tree_id: 9 } })
    api.deleteLinkTree.mockResolvedValue({})
    api.deleteAllLinkTrees.mockResolvedValue({})
    confirmAction.mockResolvedValue(true)
  })

  it('menampilkan status memuat lalu daftar', async () => {
    const pending = deferred()
    api.getLinkTrees.mockReturnValue(pending.promise)
    render(HomePage)
    expect(await screen.findByText('Memuat link tree...')).toBeInTheDocument()
    pending.resolve({ data: { link_trees: trees } })
    expect(await screen.findByText('Kursus Ku')).toBeInTheDocument()
    expect(screen.getByText('Referensi')).toBeInTheDocument()
    expect(screen.getByText('Tools')).toBeInTheDocument()
    expect(api.getLinkTrees).toHaveBeenCalledWith(false)
  })

  it('menampilkan statistik', async () => {
    await renderLoaded()
    const stats = within(screen.getByTestId('stats'))
    expect(stats.getByText('Total Link Tree').previousElementSibling).toHaveTextContent('3')
    expect(stats.getByText('Publik').previousElementSibling).toHaveTextContent('1')
    expect(stats.getByText('Tidak Terdaftar').previousElementSibling).toHaveTextContent('1')
    expect(stats.getByText('Privat').previousElementSibling).toHaveTextContent('1')
    expect(stats.getByText('Total Tautan').previousElementSibling).toHaveTextContent('4')
  })

  it('mencari berdasarkan judul', async () => {
    await renderLoaded()
    await userEvent.type(screen.getByLabelText('Cari'), 'kursus')
    await waitFor(() => expect(screen.queryByText('Referensi')).not.toBeInTheDocument())
    expect(screen.getByText('Kursus Ku')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Cari'))
    await userEvent.type(screen.getByLabelText('Cari'), 'zzz')
    expect(await screen.findByText('Tidak ada link tree.')).toBeInTheDocument()
  })

  it('menampilkan sampul absolut, relatif, atau placeholder', async () => {
    await renderLoaded()
    expect(screen.getByAltText('Kursus Ku')).toHaveAttribute('src', 'http://x.test/c.png')
    expect(screen.getByAltText('Tools')).toHaveAttribute('src', 'https://api.test/img/c/3.png')
    expect(screen.queryByAltText('Referensi')).not.toBeInTheDocument()
  })

  it('tombol hapus hanya untuk link tree milik sendiri', async () => {
    await renderLoaded()
    expect(screen.getByRole('button', { name: 'Hapus Kursus Ku' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hapus Tools' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hapus Referensi' })).not.toBeInTheDocument()
  })

  it('tanpa pengguna aktif tidak ada tombol hapus', async () => {
    currentUser.set(null)
    await renderLoaded()
    expect(screen.queryByRole('button', { name: /^Hapus / })).not.toBeInTheDocument()
  })

  it('judul mengarah ke halaman detail lewat router', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('link', { name: 'Kursus Ku' }))
    expect(window.location.pathname).toBe('/link-trees/1')
  })

  it('filter milik saya memuat ulang dan menampilkan Hapus Semua', async () => {
    await renderLoaded()
    expect(screen.queryByRole('button', { name: 'Hapus Semua' })).not.toBeInTheDocument()

    expect(await enableOnlyMine()).toBeInTheDocument()
    await waitFor(() => expect(api.getLinkTrees).toHaveBeenLastCalledWith(true))
    await waitFor(() => expect(screen.queryByText('Referensi')).not.toBeInTheDocument())

    await userEvent.click(screen.getByLabelText('Milik saya'))
    await waitFor(() => expect(api.getLinkTrees).toHaveBeenLastCalledWith(false))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Hapus Semua' })).not.toBeInTheDocument()
    )
  })

  it('Hapus Semua tidak muncul bila hasil filter kosong', async () => {
    await renderLoaded()
    api.getLinkTrees.mockResolvedValue({ data: { link_trees: [] } })
    await userEvent.click(screen.getByLabelText('Milik saya'))
    expect(await screen.findByText('Tidak ada link tree.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hapus Semua' })).not.toBeInTheDocument()
  })

  it('menampilkan error saat gagal memuat', async () => {
    api.getLinkTrees.mockRejectedValue(new Error('Gagal memuat'))
    render(HomePage)
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Gagal memuat'))
    expect(await screen.findByText('Tidak ada link tree.')).toBeInTheDocument()
  })

  it('menambah link tree lalu memuat ulang daftar', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Tambah Link Tree' }))
    expect(screen.getByRole('dialog', { name: 'Tambah Link Tree' })).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Judul'), 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() =>
      expect(api.createLinkTree).toHaveBeenCalledWith({ title: 'Baru', type: 'public', description: '' })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Link tree berhasil ditambahkan'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(api.getLinkTrees).toHaveBeenCalledTimes(2)
  })

  it('menampilkan error saat gagal menambah dan modal tetap terbuka', async () => {
    api.createLinkTree.mockRejectedValue(new Error('Data tidak valid'))
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Tambah Link Tree' }))
    await userEvent.type(screen.getByLabelText('Judul'), 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Data tidak valid'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('menutup modal tambah lewat tombol Tutup', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Tambah Link Tree' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('menghapus satu link tree setelah konfirmasi', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Kursus Ku' }))
    await waitFor(() => expect(api.deleteLinkTree).toHaveBeenCalledWith(1))
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Link tree berhasil dihapus'))
    await waitFor(() => expect(api.getLinkTrees).toHaveBeenCalledTimes(2))
  })

  it('tidak menghapus bila konfirmasi dibatalkan', async () => {
    confirmAction.mockResolvedValue(false)
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Kursus Ku' }))
    await waitFor(() => expect(confirmAction).toHaveBeenCalled())
    expect(api.deleteLinkTree).not.toHaveBeenCalled()
  })

  it('menampilkan error saat gagal menghapus', async () => {
    api.deleteLinkTree.mockRejectedValue(new Error('Tidak diizinkan'))
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Kursus Ku' }))
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Tidak diizinkan'))
  })

  it('menghapus semua link tree milik sendiri', async () => {
    await renderLoaded()
    await userEvent.click(await enableOnlyMine())
    await waitFor(() => expect(api.deleteAllLinkTrees).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(showSuccess).toHaveBeenCalledWith('Semua link tree milikmu berhasil dihapus')
    )
  })

  it('tidak menghapus semua bila konfirmasi dibatalkan', async () => {
    confirmAction.mockResolvedValue(false)
    await renderLoaded()
    await userEvent.click(await enableOnlyMine())
    await waitFor(() => expect(confirmAction).toHaveBeenCalled())
    expect(api.deleteAllLinkTrees).not.toHaveBeenCalled()
  })

  it('menampilkan error saat gagal menghapus semua', async () => {
    api.deleteAllLinkTrees.mockRejectedValue(new Error('Unauthenticated.'))
    await renderLoaded()
    await userEvent.click(await enableOnlyMine())
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Unauthenticated.'))
  })
})
