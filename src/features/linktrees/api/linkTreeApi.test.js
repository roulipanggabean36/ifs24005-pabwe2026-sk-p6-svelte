vi.mock('../../../helpers/apiHelper.js', () => ({ apiRequest: vi.fn() }))

import { apiRequest } from '../../../helpers/apiHelper.js'
import {
  getLinkTrees,
  getLinkTree,
  createLinkTree,
  updateLinkTree,
  changeCover,
  deleteLinkTree,
  deleteAllLinkTrees,
  createItem,
  updateItem,
  deleteItem
} from './linkTreeApi.js'

describe('linkTreeApi', () => {
  beforeEach(() => {
    apiRequest.mockResolvedValue({ status: 'success' })
  })

  it('getLinkTrees mengambil semua', async () => {
    await getLinkTrees(false)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees')
  })

  it('getLinkTrees dengan filter milik saya', async () => {
    await getLinkTrees(true)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees?is_me=1')
  })

  it('getLinkTree mengambil detail', async () => {
    await getLinkTree(3)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3')
  })

  it('createLinkTree memakai POST', async () => {
    const payload = { title: 'A', type: 'public', description: 'B' }
    await createLinkTree(payload)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees', { method: 'POST', body: payload })
  })

  it('updateLinkTree memakai PUT', async () => {
    const payload = { title: 'A', type: 'private', description: 'B' }
    await updateLinkTree(3, payload)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3', { method: 'PUT', body: payload })
  })

  it('changeCover mengirim FormData berisi field cover', async () => {
    const file = new File(['x'], 'c.png', { type: 'image/png' })
    await changeCover(3, file)
    const [endpoint, options] = apiRequest.mock.calls[0]
    expect(endpoint).toBe('/link-trees/3/cover')
    expect(options.method).toBe('POST')
    expect(options.body).toBeInstanceOf(FormData)
    expect(options.body.get('cover').name).toBe('c.png')
  })

  it('deleteLinkTree memakai DELETE', async () => {
    await deleteLinkTree(3)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3', { method: 'DELETE' })
  })

  it('deleteAllLinkTrees menghapus semua', async () => {
    await deleteAllLinkTrees()
    expect(apiRequest).toHaveBeenCalledWith('/link-trees', { method: 'DELETE' })
  })

  it('createItem memakai POST', async () => {
    const payload = { title: 'A', url: 'https://a.test' }
    await createItem(3, payload)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3/items', { method: 'POST', body: payload })
  })

  it('updateItem memakai PUT', async () => {
    const payload = { title: 'A', url: 'https://a.test' }
    await updateItem(3, 9, payload)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3/items/9', { method: 'PUT', body: payload })
  })

  it('deleteItem memakai DELETE', async () => {
    await deleteItem(3, 9)
    expect(apiRequest).toHaveBeenCalledWith('/link-trees/3/items/9', { method: 'DELETE' })
  })
})
