<script>
  import { onMount } from 'svelte'
  import { ArrowLeft, Link as LinkIcon, Pencil, Plus, Trash2, Image as ImageIcon } from 'lucide-svelte'
  import { go } from '../../../helpers/navigation.js'
  import {
    showError,
    showSuccess,
    confirmAction,
    resolveImageUrl
  } from '../../../helpers/toolsHelper.js'
  import { currentUser } from '../../auth/states/authStore.js'
  import {
    linkTree,
    changing,
    changingCover,
    mutatingItem,
    fetchLinkTree,
    resetLinkTree,
    changeLinkTree,
    changeLinkTreeCover,
    addItem,
    changeItem,
    removeItem
  } from '../states/linkTreesStore.js'
  import { typeLabel } from '../constants.js'
  import ChangeModal from '../modals/ChangeModal.svelte'
  import ChangeCoverModal from '../modals/ChangeCoverModal.svelte'
  import ItemModal from '../modals/ItemModal.svelte'

  let { linkTreeId } = $props()

  let loaded = $state(false)
  let modal = $state(null)
  let editingItem = $state(null)

  const load = async () => {
    try {
      await fetchLinkTree(linkTreeId)
    } catch (error) {
      showError(error.message)
    } finally {
      loaded = true
    }
  }

  onMount(() => {
    resetLinkTree()
    load()
  })

  const closeModal = () => {
    modal = null
    editingItem = null
  }

  const openAddItem = () => {
    editingItem = null
    modal = 'item'
  }

  const openEditItem = (item) => {
    editingItem = item
    modal = 'item'
  }

  const run = async (action, message) => {
    try {
      await action()
      closeModal()
      showSuccess(message)
      await load()
    } catch (error) {
      showError(error.message)
    }
  }

  const handleChange = (payload) =>
    run(() => changeLinkTree(linkTreeId, payload), 'Data link tree berhasil diubah')

  const handleCover = (file) =>
    run(() => changeLinkTreeCover(linkTreeId, file), 'Sampul berhasil diubah')

  const handleItem = (payload) =>
    editingItem
      ? run(() => changeItem(linkTreeId, editingItem.id, payload), 'Tautan berhasil diubah')
      : run(() => addItem(linkTreeId, payload), 'Tautan berhasil ditambahkan')

  const handleDeleteItem = async (item) => {
    if (!(await confirmAction(`Hapus tautan "${item.title}"?`))) return
    try {
      await removeItem(linkTreeId, item.id)
      showSuccess('Tautan berhasil dihapus')
      await load()
    } catch (error) {
      showError(error.message)
    }
  }
</script>

<div class="mx-auto max-w-3xl space-y-6">
  <a
    href="/"
    onclick={(event) => go(event, '/')}
    class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
  >
    <ArrowLeft size={16} />
    <span>Kembali</span>
  </a>

  {#if !loaded}
    <p class="text-slate-500">Memuat detail...</p>
  {:else if !$linkTree}
    <p class="text-slate-500">Link tree tidak ditemukan.</p>
  {:else}
    {@const tree = $linkTree}
    {@const owner = Boolean($currentUser) && tree.user_id === $currentUser.id}

    <article class="overflow-hidden rounded-2xl bg-white shadow">
      {#if resolveImageUrl(tree.cover)}
        <img src={resolveImageUrl(tree.cover)} alt={tree.title} class="h-48 w-full object-cover" />
      {:else}
        <div
          class="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-400"
        >
          <LinkIcon size={48} />
        </div>
      {/if}
      <div class="space-y-3 p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">{tree.title}</h1>
            <p class="text-sm text-slate-500">{tree.author.name}</p>
          </div>
          <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >{typeLabel(tree.type)}</span
          >
        </div>
        <p class="text-slate-600">{tree.description}</p>
        {#if owner}
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              onclick={() => (modal = 'change')}
              disabled={$changing}
              class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={14} />
              <span>Ubah Data</span>
            </button>
            <button
              type="button"
              onclick={() => (modal = 'cover')}
              disabled={$changingCover}
              class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <ImageIcon size={14} />
              <span>Ubah Sampul</span>
            </button>
          </div>
        {/if}
      </div>
    </article>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Tautan</h2>
        {#if owner}
          <button
            type="button"
            onclick={openAddItem}
            class="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={14} />
            <span>Tambah Tautan</span>
          </button>
        {/if}
      </div>

      {#if tree.items.length === 0}
        <p class="text-slate-500">Belum ada tautan.</p>
      {:else}
        <ul class="space-y-2">
          {#each tree.items as item (item.id)}
            <li class="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-0 flex-1 hover:text-indigo-600"
              >
                <span class="block font-medium text-slate-800">{item.title}</span>
                <span class="block truncate text-xs text-slate-400">{item.url}</span>
              </a>
              {#if owner}
                <div class="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Ubah ${item.title}`}
                    onclick={() => openEditItem(item)}
                    class="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${item.title}`}
                    onclick={() => handleDeleteItem(item)}
                    disabled={$mutatingItem}
                    class="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</div>

{#if modal === 'change'}
  <ChangeModal linkTree={$linkTree} onClose={closeModal} onSubmit={handleChange} busy={$changing} />
{:else if modal === 'cover'}
  <ChangeCoverModal onClose={closeModal} onSubmit={handleCover} busy={$changingCover} />
{:else if modal === 'item'}
  <ItemModal item={editingItem} onClose={closeModal} onSubmit={handleItem} busy={$mutatingItem} />
{/if}
