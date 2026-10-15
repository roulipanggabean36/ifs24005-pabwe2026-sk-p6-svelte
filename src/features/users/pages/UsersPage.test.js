vi.mock('../api/userApi.js', () => ({ getUsers: vi.fn() }))
vi.mock('../../../helpers/toolsHelper.js', () => ({ showError: vi.fn() }))

import { render, screen, waitFor } from '../../../test-utils.js'
import UsersPage from './UsersPage.svelte'
import { getUsers } from '../api/userApi.js'
import { showError } from '../../../helpers/toolsHelper.js'

describe('UsersPage', () => {
  it('menampilkan daftar pengguna', async () => {
    getUsers.mockResolvedValue({
      data: { users: [{ id: '1', name: 'Rouli', email: 'rouli@del.ac.id' }] }
    })
    render(UsersPage)
    expect(screen.getByText('Memuat pengguna...')).toBeInTheDocument()
    expect(await screen.findByText('rouli@del.ac.id')).toBeInTheDocument()
    expect(screen.getByText('R')).toBeInTheDocument()
  })

  it('menampilkan pesan kosong', async () => {
    getUsers.mockResolvedValue({ data: { users: [] } })
    render(UsersPage)
    expect(await screen.findByText('Belum ada pengguna.')).toBeInTheDocument()
  })

  it('menampilkan error bila gagal memuat', async () => {
    getUsers.mockRejectedValue(new Error('Gagal memuat'))
    render(UsersPage)
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Gagal memuat'))
    expect(await screen.findByText('Belum ada pengguna.')).toBeInTheDocument()
  })
})
