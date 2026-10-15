<script>
  import { onMount } from 'svelte'
  import Navbar from '../../../components/Navbar.svelte'
  import Sidebar from '../../../components/Sidebar.svelte'
  import { loadCurrentUser, logoutUser } from '../../auth/states/authStore.js'
  import { navigate } from '../../../helpers/navigation.js'

  let { children } = $props()
  let sidebarOpen = $state(false)

  onMount(async () => {
    try {
      await loadCurrentUser()
    } catch {
      await logoutUser()
      navigate('/auth/login', { replace: true })
    }
  })
</script>

<div class="min-h-screen bg-slate-50">
  <Navbar onToggleSidebar={() => (sidebarOpen = !sidebarOpen)} />
  <div class="flex">
    <Sidebar open={sidebarOpen} onClose={() => (sidebarOpen = false)} />
    <main class="min-w-0 flex-1 p-4 md:p-6">
      {@render children()}
    </main>
  </div>
</div>
