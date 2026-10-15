import { render, screen, fireEvent, waitFor, userEvent } from '../../../test-utils.js'
import ChangeCoverModal from './ChangeCoverModal.svelte'

const file = new File(['x'], 'c.png', { type: 'image/png' })

describe('ChangeCoverModal', () => {
  it('mengunggah berkas yang dipilih', async () => {
    const onSubmit = vi.fn()
    render(ChangeCoverModal, { props: { onClose: vi.fn(), onSubmit, busy: false } })
    const button = screen.getByRole('button', { name: 'Unggah' })
    expect(button).toBeDisabled()

    await userEvent.upload(screen.getByLabelText('Berkas Sampul'), file)
    await waitFor(() => expect(button).toBeEnabled())
    await userEvent.click(button)
    expect(onSubmit).toHaveBeenCalledWith(file)
  })

  it('tombol kembali nonaktif bila pilihan berkas dikosongkan', async () => {
    render(ChangeCoverModal, { props: { onClose: vi.fn(), onSubmit: vi.fn(), busy: false } })
    const input = screen.getByLabelText('Berkas Sampul')
    const button = screen.getByRole('button', { name: 'Unggah' })
    await userEvent.upload(input, file)
    await waitFor(() => expect(button).toBeEnabled())
    await fireEvent.change(input, { target: { files: [] } })
    await waitFor(() => expect(button).toBeDisabled())
  })

  it('submit tanpa berkas tidak memanggil onSubmit', async () => {
    const onSubmit = vi.fn()
    const { container } = render(ChangeCoverModal, { props: { onClose: vi.fn(), onSubmit, busy: false } })
    await fireEvent.submit(container.querySelector('form'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('menonaktifkan tombol saat sibuk dan menutup lewat Batal', async () => {
    const onClose = vi.fn()
    render(ChangeCoverModal, { props: { onClose, onSubmit: vi.fn(), busy: true } })
    expect(screen.getByRole('button', { name: 'Mengunggah...' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Batal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
