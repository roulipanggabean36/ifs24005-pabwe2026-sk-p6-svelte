<script>
  import { onMount } from 'svelte'
  import { Link as LinkIcon, Plus, Trash2 } from 'lucide-svelte'
  import { useInput } from '../../../hooks/useInput.js'
  import { go } from '../../../helpers/navigation.js'
  import {
    showError,
    showSuccess,
    confirmAction,
    resolveImageUrl
  } from '../../../helpers/toolsHelper.js'
  import { currentUser } from '../../auth/states/authStore.js'
  import {
    linkTrees,
    loading,
    adding,
    deleting,
    deletingAll,
    fetchLinkTrees,
    addLinkTree,
    removeLinkTree,
    removeAllLinkTrees
  } from '../states/linkTreesStore.js'
  import { typeLabel } from '../constants.js'
  import AddModal from '../modals/AddModal.svelte'

  const { value: search, onInput: onSearch } = useInput('')
  let onlyMine = $state(false)
  let showAdd = $state(false)

  const countType = (type) => $linkTrees.filter((item) => item.type === type).length

  const filtered = $derived(
    $linkTrees.filter((item) => item.title.toLowerCase().includes($search.toLowerCase()))
  )

  const statCards = $derived([
    { label: 'Total Link Tree', value: $linkTrees.length },
    { label: 'Publik', value: countType('public') },
    { label: 'Tidak Terdaftar', value: countType('unlisted') },
    { label: 'Privat', value: countType('private') },
    { label: 'Total Tautan', value: $linkTrees.reduce((sum, item) => sum + item.total_links, 0) }
  ])

  const isOwner = (item) => Boolean($currentUser) && item.user_id === $currentUser.id

  const load = async () => {
    try {
      await fetchLinkTrees(onlyMine)
    } catch (error) {
      showError(error.message)
    }
  }

  onMount(load)

  const toggleMine = async (event) => {
    onlyMine = event.target.checked
    await load()
  }

  const handleAdd = async (payload) => {
    try {
      await addLinkTree(payload)
      showAdd = false
      showSuccess('Link tree berhasil ditambahkan')
      await load()
    } catch (error) {
      showError(error.message)
    }
  }

  const handleDelete = async (item) => {
    if (!(await confirmAction(`Hapus link tree "${item.title}"?`))) return
    try {
      await removeLinkTree(item.id)
      showSuccess('Link tree berhasil dihapus')
      await load()
    } catch (error) {
      showError(error.message)
    }
  }

  const handleDeleteAll = async () => {
    if (!(await confirmAction('Hapus semua link tree milikmu? Tindakan ini permanen.'))) return
    try {
      await removeAllLinkTrees()
      showSuccess('Semua link tree milikmu berhasil dihapus')
      await load()
    } catch (error) {
      showError(error.message)
    }
  }
</script>

<div class="mx-auto max-w-5xl space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-bold text-slate-800">Semua Link Tree</h1>
    <div class="flex gap-2">
      {#if onlyMine && $linkTrees.length > 0}
        <button
          type="button"
          onclick={handleDeleteAll}
          disabled={$deletingAll}
          class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >Hapus Semua</button
        >
      {/if}
      <button
        type="button"
        onclick={() => (showAdd = true)}
        class="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Plus size={16} />
        <span>Tambah Link Tree</span>
      </button>
    </div>
  </div>

  <div data-testid="stats" class="grid grid-cols-2 gap-3 md:grid-cols-5">
    {#each statCards as card (card.label)}
      <div class="rounded-xl bg-white p-4 shadow">
        <p class="text-2xl font-bold text-indigo-600">{card.value}</p>
        <p class="text-xs text-slate-500">{card.label}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div class="flex-1">
      <label for="search" class="sr-only">Cari</label>
      <input
        id="search"
        type="search"
        placeholder="Cari link tree..."
        value={$search}
        oninput={onSearch}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </div>
    <label class="flex items-center gap-2 text-sm text-slate-600">
      <input type="checkbox" checked={onlyMine} onchange={toggleMine} />
      <span>Milik saya</span>
    </label>
  </div>

  {#if $loading}
    <p class="text-slate-500">Memuat link tree...</p>
  {:else if filtered.length === 0}
    <p class="text-slate-500">Tidak ada link tree.</p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item (item.id)}
        <article class="overflow-hidden rounded-xl bg-white shadow">
          {#if resolveImageUrl(item.cover)}
            <img src={resolveImageUrl(item.cover)} alt={item.title} class="h-32 w-full object-cover" />
          {:else}
            <div
              class="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-400"
            >
              <LinkIcon size={32} />
            </div>
          {/if}
          <div class="space-y-2 p-4">
            <div class="flex items-start justify-between gap-2">
              <a
                href={`/link-trees/${item.id}`}
                onclick={(event) => go(event, `/link-trees/${item.id}`)}
                class="font-semibold text-slate-800 hover:text-indigo-600">{item.title}</a
              >
              <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
                >{typeLabel(item.type)}</span
              >
            </div>
            <p class="line-clamp-2 text-sm text-slate-500">{item.description}</p>
            <div class="flex items-center justify-between text-xs text-slate-600">
              <span>{item.author.name}</span>
              <span><strong>{item.total_links}</strong> tautan</span>
              {#if isOwner(item)}
                <button
                  type="button"
                  aria-label={`Hapus ${item.title}`}
                  onclick={() => handleDelete(item)}
                  disabled={$deleting}
                  class="rounded-lg p-1 text-red-500 hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                </button>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

{#if showAdd}
  <AddModal onClose={() => (showAdd = false)} onSubmit={handleAdd} busy={$adding} />
{/if}
