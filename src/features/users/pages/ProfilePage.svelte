<script>
  import { onMount } from 'svelte'
  import { loadCurrentUser } from '../../auth/states/authStore.js'
  import { updateMe, updatePhoto, changePassword } from '../api/userApi.js'
  import { useInput } from '../../../hooks/useInput.js'
  import { showError, showSuccess, resolveImageUrl } from '../../../helpers/toolsHelper.js'

  const { value: name, onInput: onName } = useInput('')
  const { value: email, onInput: onEmail } = useInput('')
  const { value: oldPassword, onInput: onOldPassword, reset: resetOld } = useInput('')
  const { value: newPassword, onInput: onNewPassword, reset: resetNew } = useInput('')

  let user = $state(null)
  let loading = $state(true)
  let saving = $state(false)

  onMount(async () => {
    try {
      user = await loadCurrentUser()
      name.set(user.name)
      email.set(user.email)
    } catch (error) {
      showError(error.message)
    } finally {
      loading = false
    }
  })

  const run = async (action, successMessage) => {
    saving = true
    try {
      await action()
      showSuccess(successMessage)
    } catch (error) {
      showError(error.message)
    } finally {
      saving = false
    }
  }

  const submitProfile = (event) => {
    event.preventDefault()
    return run(async () => {
      await updateMe({ name: $name, email: $email })
      user = await loadCurrentUser()
    }, 'Profil berhasil diperbarui')
  }

  const uploadPhoto = (event) => {
    const file = event.target.files[0]
    if (!file) return
    return run(async () => {
      await updatePhoto(file)
      user = await loadCurrentUser()
    }, 'Foto profil berhasil diperbarui')
  }

  const submitPassword = (event) => {
    event.preventDefault()
    return run(async () => {
      await changePassword({ password: $oldPassword, new_password: $newPassword, new_password_confirmation: $newPassword })
      resetOld()
      resetNew()
    }, 'Kata sandi berhasil diubah')
  }
</script>

<div class="mx-auto max-w-2xl space-y-6">
  <h1 class="text-2xl font-bold text-slate-800">Profil Saya</h1>

  {#if loading}
    <p class="text-slate-500">Memuat profil...</p>
  {:else}
    {#if user}
      <div class="flex items-center gap-4 rounded-xl bg-white p-4 shadow">
        {#if resolveImageUrl(user.photo)}
          <img src={resolveImageUrl(user.photo)} alt="Foto profil" class="h-16 w-16 rounded-full object-cover" />
        {:else}
          <div
            data-testid="avatar-initial"
            class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div>
          <p class="font-semibold text-slate-800">{user.name}</p>
          <p class="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>
    {/if}

    <form class="space-y-4 rounded-xl bg-white p-4 shadow" onsubmit={submitProfile}>
      <h2 class="font-semibold text-slate-700">Ubah Data Profil</h2>
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
      <button
        type="submit"
        disabled={saving}
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        Simpan Profil
      </button>
    </form>

    <div class="space-y-2 rounded-xl bg-white p-4 shadow">
      <h2 class="font-semibold text-slate-700">Foto Profil</h2>
      <label for="photo" class="block text-sm font-medium text-slate-600">Ganti Foto</label>
      <input id="photo" type="file" accept="image/*" disabled={saving} onchange={uploadPhoto} class="text-sm" />
    </div>

    <form class="space-y-4 rounded-xl bg-white p-4 shadow" onsubmit={submitPassword}>
      <h2 class="font-semibold text-slate-700">Ubah Kata Sandi</h2>
      <div>
        <label for="old-password" class="mb-1 block text-sm font-medium text-slate-600">Kata Sandi Lama</label>
        <input
          id="old-password"
          type="password"
          required
          value={$oldPassword}
          oninput={onOldPassword}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label for="new-password" class="mb-1 block text-sm font-medium text-slate-600">Kata Sandi Baru</label>
        <input
          id="new-password"
          type="password"
          required
          value={$newPassword}
          oninput={onNewPassword}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        Ubah Kata Sandi
      </button>
    </form>
  {/if}
</div>
