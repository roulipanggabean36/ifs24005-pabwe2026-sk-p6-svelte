<script>
  import { go } from '../helpers/navigation.js'
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
  <p class="text-6xl font-bold text-indigo-600">404</p>
  <h1 class="text-xl font-semibold text-slate-800">Halaman tidak ditemukan</h1>
  <p class="text-slate-500">Alamat yang kamu tuju tidak tersedia.</p>
  <a
    href="/"
    onclick={(event) => go(event, '/')}
    class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
    >Kembali ke Beranda</a
  >
</div>
