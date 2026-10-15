vi.mock('../../auth/states/authStore.js', async () => {
  const { writable } = await import('svelte/store')
  return { currentUser: writable(null), loadCurrentUser: vi.fn(), logoutUser: vi.fn() }
})
vi.mock('../../../helpers/navigation.js', async () => {
  const { writable } = await import('svelte/store')
  return { currentPath: writable('/'), navigate: vi.fn(), go: vi.fn() }
})

import { createRawSnippet } from 'svelte'
import { render, screen, userEvent, waitFor } from '../../../test-utils.js'
import LinkTreeLayout from './LinkTreeLayout.svelte'
import { currentUser, loadCurrentUser, logoutUser } from '../../auth/states/authStore.js'
import { navigate } from '../../../helpers/navigation.js'

const renderLayout = () => {
  const children = createRawSnippet(() => ({ render: () => '<p>isi halaman</p>' }))
  return render(LinkTreeLayout, { props: { children } })
}

describe('LinkTreeLayout', () => {
  beforeEach(() => {
    currentUser.set({ name: 'Rouli' })
    loadCurrentUser.mockResolvedValue({ name: 'Rouli' })
    logoutUser.mockResolvedValue()
  })

  it('memuat pengguna dan merender isi', async () => {
    renderLayout()
    expect(screen.getByText('isi halaman')).toBeInTheDocument()
    await waitFor(() => expect(loadCurrentUser).toHaveBeenCalledTimes(1))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('logout dan ke login saat gagal memuat pengguna', async () => {
    loadCurrentUser.mockRejectedValue(new Error('Unauthenticated.'))
    renderLayout()
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/auth/login', { replace: true })
    )
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })

  it('membuka dan menutup sidebar', async () => {
    renderLayout()
    const aside = screen.getByRole('complementary')
    expect(aside).toHaveClass('-translate-x-full')

    await userEvent.click(screen.getByRole('button', { name: 'Buka menu' }))
    await waitFor(() => expect(aside).toHaveClass('translate-x-0'))

    await userEvent.click(screen.getByRole('link', { name: 'Pengguna' }))
    await waitFor(() => expect(aside).toHaveClass('-translate-x-full'))
  })
})
