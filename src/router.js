const routes = [
  { name: 'login', layout: 'auth', pattern: /^\/auth\/login$/, keys: [] },
  { name: 'register', layout: 'auth', pattern: /^\/auth\/register$/, keys: [] },
  { name: 'home', layout: 'app', pattern: /^\/$/, keys: [] },
  { name: 'detail', layout: 'app', pattern: /^\/link-trees\/([^/]+)$/, keys: ['linkTreeId'] },
  { name: 'users', layout: 'app', pattern: /^\/users$/, keys: [] },
  { name: 'profile', layout: 'app', pattern: /^\/profile$/, keys: [] }
]

export const matchRoute = (path) => {
  for (const route of routes) {
    const match = route.pattern.exec(path)
    if (match) {
      const params = Object.fromEntries(route.keys.map((key, index) => [key, match[index + 1]]))
      return { name: route.name, layout: route.layout, params }
    }
  }
  return { name: 'notFound', layout: 'none', params: {} }
}

export const getRedirect = (route, loggedIn) => {
  if (route.layout === 'app' && !loggedIn) return '/auth/login'
  if (route.layout === 'auth' && loggedIn) return '/'
  return null
}
