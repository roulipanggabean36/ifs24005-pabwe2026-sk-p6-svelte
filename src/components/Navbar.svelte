<script>
  import { Link as LinkIcon, LogOut, Menu } from 'lucide-svelte'
  import { currentUser, logoutUser } from '../features/auth/states/authStore.js'
  import { navigate, go } from '../helpers/navigation.js'

  let { onToggleSidebar } = $props()

  const logout = async () => {
    await logoutUser()
    navigate('/auth/login', { replace: true })
  }
</script>

<header
  class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4"
>
  <div class="flex items-center gap-3">
    <button
      type="button"
      aria-label="Buka menu"
      onclick={onToggleSidebar}
      class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
    >
      <Menu size={20} />
    </button>
    <a
      href="/"
      onclick={(event) => go(event, '/')}
      class="flex items-center gap-2 font-bold text-indigo-600"
    >
      <LinkIcon size={22} />
      <span>Delcom Link Tree</span>
    </a>
  </div>
  <div class="flex items-center gap-3">
    <a
      href="/profile"
      onclick={(event) => go(event, '/profile')}
      class="text-sm font-medium text-slate-700 hover:text-indigo-600"
    >
      {$currentUser?.name ?? 'Pengguna'}
    </a>
    <button
      type="button"
      onclick={logout}
      class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
    >
      <LogOut size={16} />
      Keluar
    </button>
  </div>
</header>
