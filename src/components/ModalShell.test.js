import { createRawSnippet } from 'svelte'
import { render, screen, userEvent } from '../test-utils.js'
import ModalShell from './ModalShell.svelte'

describe('ModalShell', () => {
  it('menampilkan judul dan isi, serta menutup lewat tombol Tutup', async () => {
    const onClose = vi.fn()
    const children = createRawSnippet(() => ({ render: () => '<p>isi modal</p>' }))
    render(ModalShell, { props: { title: 'Judul Modal', onClose, children } })

    expect(screen.getByRole('dialog', { name: 'Judul Modal' })).toBeInTheDocument()
    expect(screen.getByText('isi modal')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
