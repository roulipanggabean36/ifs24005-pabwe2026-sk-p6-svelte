<script>
  import { List, Users, User } from 'lucide-svelte'
  import { currentPath, go } from '../helpers/navigation.js'

  let { open, onClose } = $props()

  const items = [
    { label: 'Semua Link Tree', path: '/', icon: List },
    { label: 'Pengguna', path: '/users', icon: Users },
    { label: 'Profil Saya', path: '/profile', icon: User }
  ]

  const isActive = (path, itemPath) =>
    path === itemPath || (itemPath === '/' && path.startsWith('/link-trees/'))
</script>

<aside
  class={`fixed inset-y-0 left-0 z-20 mt-14 w-60 border-r border-slate-200 bg-white p-3 transition-transform md:static md:mt-0 md:min-h-[calc(100vh-3.5rem)] ${
    open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}
>
  <nav class="space-y-1" aria-label="Menu utama">
    {#each items as item (item.path)}
      {@const active = isActive($currentPath, item.path)}
      <a
        href={item.path}
        aria-current={active ? 'page' : undefined}
        onclick={(event) => {
          go(event, item.path)
          onClose()
        }}
        class={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
          active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>
