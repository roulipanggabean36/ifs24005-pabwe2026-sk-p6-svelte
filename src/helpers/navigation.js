import { writable } from 'svelte/store'

export const currentPath = writable(window.location.pathname)

export const navigate = (path, { replace = false } = {}) => {
  if (replace) {
    window.history.replaceState({}, '', path)
  } else {
    window.history.pushState({}, '', path)
  }
  currentPath.set(window.location.pathname)
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
  const sync = () => currentPath.set(window.location.pathname)
  window.addEventListener('popstate', sync)
  return () => window.removeEventListener('popstate', sync)
}
