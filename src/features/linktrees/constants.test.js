import { LINK_TREE_TYPES, typeLabel } from './constants.js'

describe('constants link tree', () => {
  it('memuat tiga tipe sesuai API', () => {
    expect(LINK_TREE_TYPES.map((type) => type.value)).toEqual(['public', 'unlisted', 'private'])
  })

  it('typeLabel memetakan label dan fallback ke nilai asli', () => {
    expect(typeLabel('public')).toBe('Publik')
    expect(typeLabel('lainnya')).toBe('lainnya')
  })
})
