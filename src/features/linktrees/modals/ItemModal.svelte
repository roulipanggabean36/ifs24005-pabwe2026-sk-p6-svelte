<script>
  import ModalShell from '../../../components/ModalShell.svelte'
  import { useInput } from '../../../hooks/useInput.js'

  let { item = null, onClose, onSubmit, busy } = $props()

  // svelte-ignore state_referenced_locally
  const { value: title, onInput: onTitle } = useInput(item ? item.title : '')
  // svelte-ignore state_referenced_locally
  const { value: url, onInput: onUrl } = useInput(item ? item.url : '')

  const labelClass = 'mb-1 block text-sm font-medium text-slate-600'
  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none'

  const submit = (event) => {
    event.preventDefault()
    onSubmit({ title: $title, url: $url })
  }
</script>

<ModalShell title={item ? 'Ubah Tautan' : 'Tambah Tautan'} {onClose}>
  <form class="space-y-4" onsubmit={submit}>
    <div>
      <label for="item-title" class={labelClass}>Judul</label>
      <input id="item-title" type="text" required value={$title} oninput={onTitle} class={inputClass} />
    </div>
    <div>
      <label for="item-url" class={labelClass}>URL</label>
      <input
        id="item-url"
        type="url"
        required
        placeholder="https://"
        value={$url}
        oninput={onUrl}
        class={inputClass}
      />
    </div>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        onclick={onClose}
        class="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Batal</button
      >
      <button
        type="submit"
        disabled={busy}
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {busy ? 'Menyimpan...' : 'Simpan'}
      </button>
    </div>
  </form>
</ModalShell>
