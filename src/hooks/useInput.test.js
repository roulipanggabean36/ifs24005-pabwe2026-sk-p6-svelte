import { describe, it, expect } from 'vitest'
import { get } from 'svelte/store'
import { useInput } from './useInput'

describe('useInput', () => {
  it('memakai nilai awal', () => {
    const { value } = useInput('halo')
    expect(get(value)).toBe('halo')
  })

  it('onInput memperbarui nilai', () => {
    const { value, onInput } = useInput('')
    onInput({ target: { value: 'baru' } })
    expect(get(value)).toBe('baru')
  })

  it('reset mengembalikan nilai awal', () => {
    const { value, onInput, reset } = useInput('awal')
    onInput({ target: { value: 'ubah' } })
    reset()
    expect(get(value)).toBe('awal')
  })
})
