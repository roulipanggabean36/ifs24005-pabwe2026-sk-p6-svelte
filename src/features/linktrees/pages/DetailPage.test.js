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

import { render, screen, waitFor, userEvent } from '../../../test-utils.js'
import DetailPage from './DetailPage.svelte'
import * as api from '../api/linkTreeApi.js'
import { showError, showSuccess, confirmAction } from '../../../helpers/toolsHelper.js'
import { currentUser } from '../../auth/states/authStore.js'

const tree = {
  id: 2,
  user_id: 1,
  title: 'Kursus Ku',
  type: 'public',
  description: 'Kumpulan kursus',
  cover: 'http://x.test/c.png',
  author: { name: 'Rouli' },
  items: [{ id: 5, link_tree_id: 2, title: 'Dasar Java', url: 'https://youtu.be/uHyfQV0kbgo' }]
}

const deferred = () => {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const renderLoaded = async () => {
  render(DetailPage, { props: { linkTreeId: '2' } })
  await screen.findByRole('heading', { name: 'Kursus Ku', level: 1 })
}

describe('DetailPage', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/link-trees/2')
    currentUser.set({ id: 1, name: 'Rouli' })
    api.getLinkTree.mockResolvedValue({ data: { link_tree: tree } })
    api.updateLinkTree.mockResolvedValue({})
    api.changeCover.mockResolvedValue({})
    api.createItem.mockResolvedValue({})
    api.updateItem.mockResolvedValue({})
    api.deleteItem.mockResolvedValue({})
    confirmAction.mockResolvedValue(true)
  })

  it('menampilkan status memuat lalu detail', async () => {
    const pending = deferred()
    api.getLinkTree.mockReturnValue(pending.promise)
    render(DetailPage, { props: { linkTreeId: '2' } })
    expect(await screen.findByText('Memuat detail...')).toBeInTheDocument()

    pending.resolve({ data: { link_tree: tree } })
    expect(await screen.findByRole('heading', { name: 'Kursus Ku', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Rouli')).toBeInTheDocument()
    expect(screen.getByText('Publik')).toBeInTheDocument()
    expect(screen.getByText('Dasar Java')).toBeInTheDocument()
    expect(screen.getByText('https://youtu.be/uHyfQV0kbgo')).toBeInTheDocument()
    expect(api.getLinkTree).toHaveBeenCalledWith('2')
  })

  it('menampilkan pesan saat link tree tidak ditemukan', async () => {
    api.getLinkTree.mockRejectedValue(new Error('Data tidak ditemukan'))
    render(DetailPage, { props: { linkTreeId: '2' } })
    expect(await screen.findByText('Link tree tidak ditemukan.')).toBeInTheDocument()
    expect(showError).toHaveBeenCalledWith('Data tidak ditemukan')
  })

  it('menampilkan sampul bila ada', async () => {
    await renderLoaded()
    expect(screen.getByAltText('Kursus Ku')).toHaveAttribute('src', 'http://x.test/c.png')
  })

  it('menampilkan placeholder bila sampul kosong', async () => {
    api.getLinkTree.mockResolvedValue({
      data: { link_tree: { ...tree, cover: 'http://localhost:8000/' } }
    })
    await renderLoaded()
    expect(screen.queryByAltText('Kursus Ku')).not.toBeInTheDocument()
  })

  it('menampilkan pesan bila belum ada tautan', async () => {
    api.getLinkTree.mockResolvedValue({ data: { link_tree: { ...tree, items: [] } } })
    await renderLoaded()
    expect(screen.getByText('Belum ada tautan.')).toBeInTheDocument()
  })

  it('tanpa pengguna aktif tidak ada kontrol ubah', async () => {
    currentUser.set(null)
    await renderLoaded()
    expect(screen.queryByRole('button', { name: 'Ubah Data' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tambah Tautan' })).not.toBeInTheDocument()
  })

  it('pengguna lain tidak melihat kontrol ubah', async () => {
    currentUser.set({ id: 99, name: 'Lain' })
    await renderLoaded()
    expect(screen.queryByRole('button', { name: 'Ubah Sampul' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ubah Dasar Java' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hapus Dasar Java' })).not.toBeInTheDocument()
  })

  it('tautan Kembali memakai router', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('link', { name: 'Kembali' }))
    expect(window.location.pathname).toBe('/')
  })

  it('mengubah data link tree', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Data' }))
    expect(screen.getByRole('dialog', { name: 'Ubah Link Tree' })).toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText('Judul'))
    await userEvent.type(screen.getByLabelText('Judul'), 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))

    await waitFor(() =>
      expect(api.updateLinkTree).toHaveBeenCalledWith('2', {
        title: 'Baru',
        type: 'public',
        description: 'Kumpulan kursus'
      })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Data link tree berhasil diubah'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(api.getLinkTree).toHaveBeenCalledTimes(2)
  })

  it('menampilkan error saat gagal mengubah data dan modal tetap terbuka', async () => {
    api.updateLinkTree.mockRejectedValue(new Error('Data tidak valid'))
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Data' }))
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Data tidak valid'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('menutup modal lewat tombol Tutup', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Data' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('mengubah sampul', async () => {
    const file = new File(['x'], 'c.png', { type: 'image/png' })
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Sampul' }))
    await userEvent.upload(screen.getByLabelText('Berkas Sampul'), file)
    await userEvent.click(await screen.findByRole('button', { name: 'Unggah' }))
    await waitFor(() => expect(api.changeCover).toHaveBeenCalledWith('2', file))
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Sampul berhasil diubah'))
  })

  it('menambah tautan', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Tambah Tautan' }))
    expect(screen.getByRole('dialog', { name: 'Tambah Tautan' })).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Judul'), 'Delcom')
    await userEvent.type(screen.getByLabelText('URL'), 'https://delcom.org')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() =>
      expect(api.createItem).toHaveBeenCalledWith('2', { title: 'Delcom', url: 'https://delcom.org' })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Tautan berhasil ditambahkan'))
  })

  it('mengubah tautan', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Dasar Java' }))
    expect(screen.getByRole('dialog', { name: 'Ubah Tautan' })).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveValue('Dasar Java')
    await userEvent.clear(screen.getByLabelText('Judul'))
    await userEvent.type(screen.getByLabelText('Judul'), 'Java Lanjut')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    await waitFor(() =>
      expect(api.updateItem).toHaveBeenCalledWith('2', 5, {
        title: 'Java Lanjut',
        url: 'https://youtu.be/uHyfQV0kbgo'
      })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Tautan berhasil diubah'))
  })

  it('menghapus tautan setelah konfirmasi', async () => {
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Dasar Java' }))
    await waitFor(() => expect(api.deleteItem).toHaveBeenCalledWith('2', 5))
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Tautan berhasil dihapus'))
    await waitFor(() => expect(api.getLinkTree).toHaveBeenCalledTimes(2))
  })

  it('tidak menghapus tautan bila konfirmasi dibatalkan', async () => {
    confirmAction.mockResolvedValue(false)
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Dasar Java' }))
    await waitFor(() => expect(confirmAction).toHaveBeenCalled())
    expect(api.deleteItem).not.toHaveBeenCalled()
  })

  it('menampilkan error saat gagal menghapus tautan', async () => {
    api.deleteItem.mockRejectedValue(new Error('Tidak diizinkan'))
    await renderLoaded()
    await userEvent.click(screen.getByRole('button', { name: 'Hapus Dasar Java' }))
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Tidak diizinkan'))
  })
})
