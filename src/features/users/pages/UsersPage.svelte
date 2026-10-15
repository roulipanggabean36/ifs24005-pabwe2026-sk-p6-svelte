<script>
  import { onMount } from 'svelte'
  import { getUsers } from '../api/userApi.js'
  import { showError } from '../../../helpers/toolsHelper.js'

  let users = $state([])
  let loading = $state(true)

  onMount(async () => {
    try {
      const response = await getUsers()
      users = response.data.users
    } catch (error) {
      showError(error.message)
    } finally {
      loading = false
    }
  })
</script>

<div class="mx-auto max-w-3xl space-y-4">
  <h1 class="text-2xl font-bold text-slate-800">Pengguna</h1>
  {#if loading}
    <p class="text-slate-500">Memuat pengguna...</p>
  {:else if users.length === 0}
    <p class="text-slate-500">Belum ada pengguna.</p>
  {:else}
    <ul class="divide-y divide-slate-100 rounded-xl bg-white shadow">
      {#each users as user (user.id)}
        <li class="flex items-center gap-3 p-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="font-medium text-slate-800">{user.name}</p>
            <p class="text-sm text-slate-500">{user.email}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
