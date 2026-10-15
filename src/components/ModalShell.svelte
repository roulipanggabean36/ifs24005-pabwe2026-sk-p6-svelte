<script>
  import { X } from 'lucide-svelte'

  let { title, onClose, children } = $props()
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <div
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">{title}</h2>
      <button
        type="button"
        aria-label="Tutup"
        onclick={onClose}
        class="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
      >
        <X size={18} />
      </button>
    </div>
    {@render children()}
  </div>
</div>
