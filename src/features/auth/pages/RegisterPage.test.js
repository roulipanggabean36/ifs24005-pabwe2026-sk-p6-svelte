vi.mock('../states/authStore.js', () => ({ registerUser: vi.fn() }))
vi.mock('../../../helpers/toolsHelper.js', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))
vi.mock('../../../helpers/navigation.js', () => ({ navigate: vi.fn(), go: vi.fn() }))

import { render, screen, waitFor, userEvent } from '../../../test-utils.js'
import RegisterPage from './RegisterPage.svelte'
import { registerUser } from '../states/authStore.js'
import { showError, showSuccess } from '../../../helpers/toolsHelper.js'
import { navigate, go } from '../../../helpers/navigation.js'

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText('Nama'), 'Rouli')
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com')
  await userEvent.type(screen.getByLabelText('Kata Sandi'), 'rahasia1')
  await userEvent.click(screen.getByRole('button', { name: 'Daftar' }))
}

describe('RegisterPage', () => {
  it('registrasi berhasil lalu ke halaman login', async () => {
    let resolveRegister
    registerUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve
        })
    )
    render(RegisterPage)
    await fillAndSubmit()
    expect(await screen.findByRole('button', { name: 'Memproses...' })).toBeDisabled()
    expect(registerUser).toHaveBeenCalledWith({
      name: 'Rouli',
      email: 'a@b.com',
      password: 'rahasia1'
    })

    resolveRegister({})
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/auth/login'))
    expect(showSuccess).toHaveBeenCalledWith('Registrasi berhasil, silakan masuk')
  })

  it('menampilkan error saat registrasi gagal', async () => {
    registerUser.mockRejectedValue(new Error('Email sudah terdaftar'))
    render(RegisterPage)
    await fillAndSubmit()
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Email sudah terdaftar'))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('tautan Masuk memakai navigasi router', async () => {
    render(RegisterPage)
    await userEvent.click(screen.getByRole('link', { name: 'Masuk' }))
    expect(go).toHaveBeenCalledWith(expect.anything(), '/auth/login')
  })
})
