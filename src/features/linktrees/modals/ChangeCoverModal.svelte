<script>
  import ModalShell from '../../../components/ModalShell.svelte'

  let { onClose, onSubmit, busy } = $props()

  let file = $state(null)

  const onFile = (event) => {
    file = event.target.files[0] || null
  }

  const submit = (event) => {
    event.preventDefault()
    if (!file) return
    onSubmit(file)
  }
</script>

<ModalShell title="Ubah Sampul" {onClose}>
  <form class="space-y-4" onsubmit={submit}>
    <div>
      <label for="cover-file" class="mb-1 block text-sm font-medium text-slate-600">Berkas Sampul</label>
      <input id="cover-file" type="file" accept="image/*" onchange={onFile} class="text-sm" />
    </div>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        onclick={onClose}
        class="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Batal</button
      >
      <button
        type="submit"
        disabled={!file || busy}
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {busy ? 'Mengunggah...' : 'Unggah'}
      </button>
    </div>
  </form>
</ModalShell>
