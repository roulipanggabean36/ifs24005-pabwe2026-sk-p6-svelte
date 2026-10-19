const loadSwal = async () => (await import('sweetalert2')).default

export const showSuccess = async (text) => {
  const Swal = await loadSwal()
  return Swal.fire({ icon: 'success', title: 'Berhasil', text, timer: 1800, showConfirmButton: false })
}

export const showError = async (text) => {
  const Swal = await loadSwal()
  return Swal.fire({ icon: 'error', title: 'Gagal', text })
}

export const confirmAction = async (text) => {
  const Swal = await loadSwal()
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi',
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, lanjutkan',
    cancelButtonText: 'Batal'
  })
  return result.isConfirmed === true
}

export const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const resolveImageUrl = (path) => {
  if (!path || path.endsWith('/')) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${new URL(import.meta.env.VITE_DELCOM_BASEURL).origin}/${path.replace(/^\/+/g, '')}`
}
