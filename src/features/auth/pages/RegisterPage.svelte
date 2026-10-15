<script>
  import { useInput } from '../../../hooks/useInput.js'
  import { registerUser } from '../states/authStore.js'
  import { navigate, go } from '../../../helpers/navigation.js'
  import { showError, showSuccess } from '../../../helpers/toolsHelper.js'

  const { value: name, onInput: onName } = useInput('')
  const { value: email, onInput: onEmail } = useInput('')
  const { value: password, onInput: onPassword } = useInput('')
  let loading = $state(false)

  const submit = async (event) => {
    event.preventDefault()
    loading = true
    try {
      await registerUser({ name: $name, email: $email, password: $password })
      showSuccess('Registrasi berhasil, silakan masuk')
      navigate('/auth/login')
    } catch (error) {
      showError(error.message)
    } finally {
      loading = false
    }
  }
</script>

<form class="space-y-4" onsubmit={submit}>
  <h2 class="text-center text-lg font-semibold text-slate-700">Buat akun baru</h2>
  <div>
    <label for="name" class="mb-1 block text-sm font-medium text-slate-600">Nama</label>
    <input
      id="name"
      type="text"
      required
      value={$name}
      oninput={onName}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
    />
  </div>
  <div>
    <label for="email" class="mb-1 block text-sm font-medium text-slate-600">Email</label>
    <input
      id="email"
      type="email"
      required
      value={$email}
      oninput={onEmail}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
    />
  </div>
  <div>
    <label for="password" class="mb-1 block text-sm font-medium text-slate-600">Kata Sandi</label>
    <input
      id="password"
      type="password"
      required
      value={$password}
      oninput={onPassword}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
    />
  </div>
  <button
    type="submit"
    disabled={loading}
    class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
  >
    {loading ? 'Memproses...' : 'Daftar'}
  </button>
  <p class="text-center text-sm text-slate-500">
    Sudah punya akun?
    <a
      href="/auth/login"
      class="font-semibold text-indigo-600 hover:underline"
      onclick={(event) => go(event, '/auth/login')}>Masuk</a
    >
  </p>
</form>
