import { render, screen, userEvent } from '../../../test-utils.js'
import ChangeModal from './ChangeModal.svelte'

const linkTree = { id: 1, title: 'Lama', type: 'unlisted', description: 'Desk' }

describe('ChangeModal', () => {
  it('mengisi form dari data link tree lalu mengirim perubahan', async () => {
    const onSubmit = vi.fn()
    render(ChangeModal, { props: { linkTree, onClose: vi.fn(), onSubmit, busy: false } })
    expect(screen.getByRole('dialog', { name: 'Ubah Link Tree' })).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveValue('Lama')
    expect(screen.getByLabelText('Tipe')).toHaveValue('unlisted')
    expect(screen.getByLabelText('Deskripsi')).toHaveValue('Desk')

    await userEvent.clear(screen.getByLabelText('Judul'))
    await userEvent.type(screen.getByLabelText('Judul'), 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Baru', type: 'unlisted', description: 'Desk' })
  })

  it('deskripsi null menjadi string kosong', () => {
    render(ChangeModal, {
      props: { linkTree: { ...linkTree, description: null }, onClose: vi.fn(), onSubmit: vi.fn(), busy: false }
    })
    expect(screen.getByLabelText('Deskripsi')).toHaveValue('')
  })

  it('mengubah tipe dan menutup lewat Batal', async () => {
    const onSubmit = vi.fn()
    const onClose = vi.fn()
    render(ChangeModal, { props: { linkTree, onClose, onSubmit, busy: false } })
    await userEvent.selectOptions(screen.getByLabelText('Tipe'), 'public')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Lama', type: 'public', description: 'Desk' })

    await userEvent.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('menonaktifkan tombol saat sibuk', () => {
    render(ChangeModal, { props: { linkTree, onClose: vi.fn(), onSubmit: vi.fn(), busy: true } })
    expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled()
  })
})

describe('ChangeModal ubah deskripsi', () => {
  it('mengirim deskripsi baru', async () => {
    const onSubmit = vi.fn()
    render(ChangeModal, { props: { linkTree, onClose: vi.fn(), onSubmit, busy: false } })
    await userEvent.clear(screen.getByLabelText('Deskripsi'))
    await userEvent.type(screen.getByLabelText('Deskripsi'), 'Deskripsi baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Lama',
      type: 'unlisted',
      description: 'Deskripsi baru'
    })
  })
})