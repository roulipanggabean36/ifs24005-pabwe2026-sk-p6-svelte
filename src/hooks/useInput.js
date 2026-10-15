import { writable } from 'svelte/store'

export const useInput = (initialValue) => {
  const value = writable(initialValue)
  const onInput = (event) => value.set(event.target.value)
  const reset = () => value.set(initialValue)
  return { value, onInput, reset }
}
