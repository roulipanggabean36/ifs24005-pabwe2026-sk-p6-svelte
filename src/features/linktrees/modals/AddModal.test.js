import { render, screen, userEvent } from '../../../test-utils.js'
import AddModal from './AddModal.svelte'

describe('AddModal', () => {
  it('mengirim data yang diisi', async () => {
    const onSubmit = vi.fn()
    render(AddModal, { props: { onClose: vi.fn(), onSubmit, busy: false } })
    expect(screen.getByRole('dialog', { name: 'Tambah Link Tree' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Judul'), 'Kursus Ku')
    await userEvent.selectOptions(screen.getByLabelText('Tipe'), 'private')
    await userEvent.type(screen.getByLabelText('Deskripsi'), 'Kumpulan kursus')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Kursus Ku',
      type: 'private',
      description: 'Kumpulan kursus'
    })
  })

  it('memakai tipe publik secara default', async () => {
    const onSubmit = vi.fn()
    render(AddModal, { props: { onClose: vi.fn(), onSubmit, busy: false } })
    await userEvent.type(screen.getByLabelText('Judul'), 'A')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'A', type: 'public', description: '' })
  })

  it('menutup lewat Batal', async () => {
    const onClose = vi.fn()
    render(AddModal, { props: { onClose, onSubmit: vi.fn(), busy: false } })
    await userEvent.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('menonaktifkan tombol saat sibuk', () => {
    render(AddModal, { props: { onClose: vi.fn(), onSubmit: vi.fn(), busy: true } })
    expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled()
  })
})
