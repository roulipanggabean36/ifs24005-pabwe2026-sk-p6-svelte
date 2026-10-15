import { render, screen, userEvent } from '../test-utils.js'
import NotFoundPage from './NotFoundPage.svelte'

describe('NotFoundPage', () => {
  it('menampilkan pesan dan tautan kembali ke beranda', async () => {
    window.history.replaceState({}, '', '/tidak-ada')
    render(NotFoundPage)
    expect(screen.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Kembali ke Beranda' }))
    expect(window.location.pathname).toBe('/')
  })
})
