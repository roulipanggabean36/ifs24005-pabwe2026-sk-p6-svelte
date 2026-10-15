export const LINK_TREE_TYPES = [
  { value: 'public', label: 'Publik' },
  { value: 'unlisted', label: 'Tidak Terdaftar' },
  { value: 'private', label: 'Privat' }
]

export const typeLabel = (value) =>
  LINK_TREE_TYPES.find((type) => type.value === value)?.label ?? value
