import { get } from 'svelte/store'
import { currentPath, navigate, go, initNavigation } from './navigation'

const makeEvent = (overrides = {}) => ({
  defaultPrevented: false,
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  preventDefault: vi.fn(),
  ...overrides
})

describe('navigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    currentPath.set('/')
  })

  it('navigate memakai pushState dan membuang query', () => {
    const before = window.history.length
    navigate('/a?x=1')
    expect(window.history.length).toBe(before + 1)
    expect(get(currentPath)).toBe('/a')
  })

  it('navigate dengan replace tidak menambah riwayat', () => {
    const before = window.history.length
    navigate('/b', { replace: true })
    expect(window.history.length).toBe(before)
    expect(get(currentPath)).toBe('/b')
  })

  it('go mencegah default dan berpindah halaman', () => {
    const event = makeEvent()
    go(event, '/link-trees/1')
    expect(event.preventDefault).toHaveBeenCalled()
    expect(get(currentPath)).toBe('/link-trees/1')
  })

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
    { defaultPrevented: true }
  ])('go mengabaikan klik khusus %o', (overrides) => {
    const event = makeEvent(overrides)
    go(event, '/x')
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(get(currentPath)).toBe('/')
  })

  it('initNavigation menyinkronkan popstate dan bisa dibersihkan', () => {
    const cleanup = initNavigation()
    window.history.pushState({}, '', '/zzz')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(get(currentPath)).toBe('/zzz')

    cleanup()
    window.history.pushState({}, '', '/yyy')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(get(currentPath)).toBe('/zzz')
  })
})
