import { matchRoute, getRedirect } from './router.js'

describe('matchRoute', () => {
  it.each([
    ['/auth/login', 'login', 'auth'],
    ['/auth/register', 'register', 'auth'],
    ['/', 'home', 'app'],
    ['/users', 'users', 'app'],
    ['/profile', 'profile', 'app']
  ])('mencocokkan %s', (path, name, layout) => {
    expect(matchRoute(path)).toEqual({ name, layout, params: {} })
  })

  it('mencocokkan detail dengan parameter linkTreeId', () => {
    expect(matchRoute('/link-trees/12')).toEqual({
      name: 'detail',
      layout: 'app',
      params: { linkTreeId: '12' }
    })
  })

  it.each(['/link-trees', '/link-trees/1/extra', '/tidak-ada', '/users/'])(
    'path %s menjadi notFound',
    (path) => {
      expect(matchRoute(path)).toEqual({ name: 'notFound', layout: 'none', params: {} })
    }
  )
})

describe('getRedirect', () => {
  it('halaman aplikasi tanpa login diarahkan ke login', () => {
    expect(getRedirect({ layout: 'app' }, false)).toBe('/auth/login')
  })

  it('halaman aplikasi dengan login tidak diarahkan', () => {
    expect(getRedirect({ layout: 'app' }, true)).toBeNull()
  })

  it('halaman autentikasi dengan login diarahkan ke beranda', () => {
    expect(getRedirect({ layout: 'auth' }, true)).toBe('/')
  })

  it('halaman autentikasi tanpa login tidak diarahkan', () => {
    expect(getRedirect({ layout: 'auth' }, false)).toBeNull()
  })

  it('halaman tanpa layout tidak pernah diarahkan', () => {
    expect(getRedirect({ layout: 'none' }, false)).toBeNull()
    expect(getRedirect({ layout: 'none' }, true)).toBeNull()
  })
})
