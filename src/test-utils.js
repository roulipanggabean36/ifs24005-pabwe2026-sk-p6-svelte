import { render, screen, fireEvent, waitFor, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

export const mockFetchResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body
})

export const mockBrokenJsonResponse = ({ ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => {
    throw new Error('invalid json')
  }
})

export { render, screen, fireEvent, waitFor, within, userEvent }
