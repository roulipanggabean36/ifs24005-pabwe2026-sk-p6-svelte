import { createRawSnippet } from 'svelte'
import { render, screen } from '../../../test-utils.js'
import AuthLayout from './AuthLayout.svelte'

describe('AuthLayout', () => {
  it('menampilkan judul, deskripsi koleksi tautan, dan isi', () => {
    const children = createRawSnippet(() => ({ render: () => '<p>isi halaman</p>' }))
    render(AuthLayout, { props: { children } })
    expect(screen.getByRole('heading', { name: 'Delcom Link Tree' })).toBeInTheDocument()
    expect(screen.getByText(/semua tautan pentingmu/i)).toBeInTheDocument()
    expect(screen.getByText('isi halaman')).toBeInTheDocument()
  })
})

describe('AuthLayout landmark', () => {
  it('isi dibungkus satu landmark main', () => {
    const children = createRawSnippet(() => ({ render: () => '<p>isi</p>' }))
    render(AuthLayout, { props: { children } })
    expect(screen.getAllByRole('main')).toHaveLength(1)
  })
})