import { render, screen, userEvent } from '../../../test-utils.js'
import ItemModal from './ItemModal.svelte'

describe('ItemModal', () => {
  it('mode tambah mengirim tautan baru', async () => {
    const onSubmit = vi.fn()
    render(ItemModal, { props: { onClose: vi.fn(), onSubmit, busy: false } })
    expect(screen.getByRole('dialog', { name: 'Tambah Tautan' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Judul'), 'Delcom')
    await userEvent.type(screen.getByLabelText('URL'), 'https://delcom.org')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Delcom', url: 'https://delcom.org' })
  })

  it('mode ubah memakai nilai tautan yang ada', async () => {
    const onSubmit = vi.fn()
    const item = { id: 2, title: 'Lama', url: 'https://lama.test' }
    render(ItemModal, { props: { item, onClose: vi.fn(), onSubmit, busy: false } })
    expect(screen.getByRole('dialog', { name: 'Ubah Tautan' })).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveValue('Lama')
    expect(screen.getByLabelText('URL')).toHaveValue('https://lama.test')

    await userEvent.clear(screen.getByLabelText('Judul'))
    await userEvent.type(screen.getByLabelText('Judul'), 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Baru', url: 'https://lama.test' })
  })

  it('menutup lewat Batal dan menonaktifkan tombol saat sibuk', async () => {
    const onClose = vi.fn()
    render(ItemModal, { props: { onClose, onSubmit: vi.fn(), busy: true } })
    expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
