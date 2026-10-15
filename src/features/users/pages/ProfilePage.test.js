vi.mock('../../auth/states/authStore.js', () => ({ loadCurrentUser: vi.fn() }))
vi.mock('../api/userApi.js', () => ({
  updateMe: vi.fn(),
  updatePhoto: vi.fn(),
  changePassword: vi.fn()
}))
vi.mock('../../../helpers/toolsHelper.js', () => ({ showError: vi.fn(), showSuccess: vi.fn(), resolveImageUrl: (path) => path || null }))

import { render, screen, waitFor, fireEvent, userEvent } from '../../../test-utils.js'
import ProfilePage from './ProfilePage.svelte'
import { loadCurrentUser } from '../../auth/states/authStore.js'
import { updateMe, updatePhoto, changePassword } from '../api/userApi.js'
import { showError, showSuccess } from '../../../helpers/toolsHelper.js'

const baseUser = { name: 'Rouli', email: 'rouli@del.ac.id', photo: null }

describe('ProfilePage', () => {
  beforeEach(() => {
    loadCurrentUser.mockResolvedValue(baseUser)
    updateMe.mockResolvedValue({})
    updatePhoto.mockResolvedValue({})
    changePassword.mockResolvedValue({})
  })

  it('memuat profil dan mengisi form', async () => {
    render(ProfilePage)
    expect(screen.getByText('Memuat profil...')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Nama')).toHaveValue('Rouli'))
    expect(screen.getByLabelText('Email')).toHaveValue('rouli@del.ac.id')
    expect(screen.getByTestId('avatar-initial')).toHaveTextContent('R')
  })

  it('menampilkan foto bila tersedia', async () => {
    loadCurrentUser.mockResolvedValue({ ...baseUser, photo: 'http://x.test/p.png' })
    render(ProfilePage)
    expect(await screen.findByAltText('Foto profil')).toHaveAttribute('src', 'http://x.test/p.png')
  })

  it('tetap menampilkan form saat gagal memuat', async () => {
    loadCurrentUser.mockRejectedValue(new Error('Gagal memuat profil'))
    render(ProfilePage)
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Gagal memuat profil'))
    expect(await screen.findByLabelText('Nama')).toHaveValue('')
    expect(screen.queryByTestId('avatar-initial')).not.toBeInTheDocument()
  })

  it('menyimpan perubahan profil', async () => {
    render(ProfilePage)
    const nameInput = await screen.findByLabelText('Nama')
    await waitFor(() => expect(nameInput).toHaveValue('Rouli'))
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Baru')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan Profil' }))
    await waitFor(() =>
      expect(updateMe).toHaveBeenCalledWith({ name: 'Baru', email: 'rouli@del.ac.id' })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Profil berhasil diperbarui'))
  })

  it('menampilkan error bila simpan profil gagal', async () => {
    updateMe.mockRejectedValue(new Error('Email dipakai'))
    render(ProfilePage)
    await waitFor(() => expect(screen.getByLabelText('Nama')).toHaveValue('Rouli'))
    await userEvent.click(screen.getByRole('button', { name: 'Simpan Profil' }))
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Email dipakai'))
    expect(showSuccess).not.toHaveBeenCalled()
  })

  it('mengunggah foto baru', async () => {
    render(ProfilePage)
    const input = await screen.findByLabelText('Ganti Foto')
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    await userEvent.upload(input, file)
    await waitFor(() => expect(updatePhoto).toHaveBeenCalledWith(file))
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Foto profil berhasil diperbarui'))
  })

  it('mengabaikan perubahan foto tanpa file', async () => {
    render(ProfilePage)
    const input = await screen.findByLabelText('Ganti Foto')
    await fireEvent.change(input, { target: { files: [] } })
    expect(updatePhoto).not.toHaveBeenCalled()
  })

  it('mengubah kata sandi lalu mengosongkan form', async () => {
    render(ProfilePage)
    const oldInput = await screen.findByLabelText('Kata Sandi Lama')
    const newInput = screen.getByLabelText('Kata Sandi Baru')
    await userEvent.type(oldInput, 'lama123')
    await userEvent.type(newInput, 'baru1234')
    await userEvent.click(screen.getByRole('button', { name: 'Ubah Kata Sandi' }))
    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({ password: 'lama123', new_password: 'baru1234', new_password_confirmation: 'baru1234' })
    )
    await waitFor(() => expect(showSuccess).toHaveBeenCalledWith('Kata sandi berhasil diubah'))
    await waitFor(() => expect(oldInput).toHaveValue(''))
    expect(newInput).toHaveValue('')
  })
})

describe('ProfilePage ubah email', () => {
  beforeEach(() => {
    loadCurrentUser.mockResolvedValue(baseUser)
    updateMe.mockResolvedValue({})
  })

  it('mengirim email baru saat form disimpan', async () => {
    render(ProfilePage)
    const emailInput = await screen.findByLabelText('Email')
    await waitFor(() => expect(emailInput).toHaveValue('rouli@del.ac.id'))
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'baru@del.ac.id')
    await userEvent.click(screen.getByRole('button', { name: 'Simpan Profil' }))
    await waitFor(() =>
      expect(updateMe).toHaveBeenCalledWith({ name: 'Rouli', email: 'baru@del.ac.id' })
    )
  })
})
