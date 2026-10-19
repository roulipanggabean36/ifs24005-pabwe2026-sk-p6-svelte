import { writable } from 'svelte/store'

export const currentPath = writable(globalThis.location.pathname)

export const navigate = (path, { replace = false } = {}) => {
  if (replace) {
    globalThis.history.replaceState({}, '', path)
  } else {
    globalThis.history.pushState({}, '', path)
  }
  currentPath.set(globalThis.location.pathname)
}

export const go = (event, path) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }
  event.preventDefault()
  navigate(path)
}

export const initNavigation = () => {
  const sync = () => currentPath.set(globalThis.location.pathname)
  globalThis.addEventListener('popstate', sync)
  return () => globalThis.removeEventListener('popstate', sync)
}
