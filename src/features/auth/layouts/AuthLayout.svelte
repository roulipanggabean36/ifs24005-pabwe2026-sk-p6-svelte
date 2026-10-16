<script>
  import { Link as LinkIcon } from 'lucide-svelte'

  let { children } = $props()
</script>

<main class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-100 p-4">
  <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
    <div class="mb-6 text-center">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white">
        <LinkIcon size={28} />
      </div>
      <h1 class="text-2xl font-bold text-slate-800">Delcom Link Tree</h1>
      <p class="mt-1 text-sm text-slate-600">
        Kumpulkan dan bagikan semua tautan pentingmu dalam satu tempat.
      </p>
    </div>
    {@render children()}
  </div>
</main>
