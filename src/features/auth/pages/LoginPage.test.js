vi.mock('../states/authStore.js', () => ({ loginUser: vi.fn() }))
vi.mock('../../../helpers/toolsHelper.js', () => ({ showError: vi.fn() }))
vi.mock('../../../helpers/navigation.js', () => ({ navigate: vi.fn(), go: vi.fn() }))

import { render, screen, waitFor, userEvent } from '../../../test-utils.js'
import LoginPage from './LoginPage.svelte'
import { loginUser } from '../states/authStore.js'
import { showError } from '../../../helpers/toolsHelper.js'
import { navigate, go } from '../../../helpers/navigation.js'

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com')
  await userEvent.type(screen.getByLabelText('Kata Sandi'), 'rahasia1')
  await userEvent.click(screen.getByRole('button', { name: 'Masuk' }))
}

describe('LoginPage', () => {
  it('login berhasil, tombol sibuk saat proses, lalu ke beranda', async () => {
    let resolveLogin
    loginUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve
        })
    )
    render(LoginPage)
    await fillAndSubmit()
    expect(await screen.findByRole('button', { name: 'Memproses...' })).toBeDisabled()
    expect(loginUser).toHaveBeenCalledWith({ email: 'a@b.com', password: 'rahasia1' })

    resolveLogin({})
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/', { replace: true }))
    expect(await screen.findByRole('button', { name: 'Masuk' })).toBeEnabled()
  })

  it('menampilkan error saat login gagal', async () => {
    loginUser.mockRejectedValue(new Error('Email atau kata sandi salah'))
    render(LoginPage)
    await fillAndSubmit()
    await waitFor(() => expect(showError).toHaveBeenCalledWith('Email atau kata sandi salah'))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('tautan Daftar memakai navigasi router', async () => {
    render(LoginPage)
    await userEvent.click(screen.getByRole('link', { name: 'Daftar' }))
    expect(go).toHaveBeenCalledWith(expect.anything(), '/auth/register')
  })
})
