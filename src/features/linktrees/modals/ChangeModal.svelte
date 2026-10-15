<script>
  import ModalShell from '../../../components/ModalShell.svelte'
  import { useInput } from '../../../hooks/useInput.js'
  

  let { linkTree, onClose, onSubmit, busy } = $props()

  // svelte-ignore state_referenced_locally
  const { value: title, onInput: onTitle } = useInput(linkTree.title)
  // svelte-ignore state_referenced_locally
  const { value: type, onInput: onType } = useInput(linkTree.type)
  // svelte-ignore state_referenced_locally
  const { value: description, onInput: onDescription } = useInput(linkTree.description || '')

  const labelClass = 'mb-1 block text-sm font-medium text-slate-600'
  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none'

  const submit = (event) => {
    event.preventDefault()
    onSubmit({ title: $title, type: $type, description: $description })
  }
</script>

<ModalShell title="Ubah Link Tree" {onClose}>
  <form class="space-y-4" onsubmit={submit}>
    <div>
      <label for="change-title" class={labelClass}>Judul</label>
      <input id="change-title" type="text" required value={$title} oninput={onTitle} class={inputClass} />
    </div>
    <div>
      <label for="change-type" class={labelClass}>Tipe</label>
      <select id="change-type" onchange={onType} class={inputClass}>
        <option value="public" selected={$type === 'public'}>Publik</option>
        <option value="unlisted" selected={$type === 'unlisted'}>Tidak Terdaftar</option>
        <option value="private" selected={$type === 'private'}>Privat</option>
          
        
      </select>
    </div>
    <div>
      <label for="change-description" class={labelClass}>Deskripsi</label>
      <textarea
        id="change-description"
        rows="3"
        value={$description}
        oninput={onDescription}
        class={inputClass}
      ></textarea>
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
