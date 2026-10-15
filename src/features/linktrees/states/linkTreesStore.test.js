vi.mock('../api/linkTreeApi.js', () => ({
  getLinkTrees: vi.fn(),
  getLinkTree: vi.fn(),
  createLinkTree: vi.fn(),
  updateLinkTree: vi.fn(),
  changeCover: vi.fn(),
  deleteLinkTree: vi.fn(),
  deleteAllLinkTrees: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}))

import { get } from 'svelte/store'
import * as api from '../api/linkTreeApi.js'
import * as store from './linkTreesStore.js'

const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const file = new File(['x'], 'c.png', { type: 'image/png' })

describe('linkTreesStore fetch', () => {
  it('fetchLinkTrees mengisi koleksi', async () => {
    api.getLinkTrees.mockResolvedValue({ data: { link_trees: [{ id: 1 }] } })
    const result = await store.fetchLinkTrees(true)
    expect(api.getLinkTrees).toHaveBeenCalledWith(true)
    expect(result).toEqual([{ id: 1 }])
    expect(get(store.linkTrees)).toEqual([{ id: 1 }])
    expect(get(store.loading)).toBe(false)
  })

  it('fetchLinkTree mengisi detail dan resetLinkTree mengosongkannya', async () => {
    api.getLinkTree.mockResolvedValue({ data: { link_tree: { id: 5, items: [] } } })
    const result = await store.fetchLinkTree(5)
    expect(api.getLinkTree).toHaveBeenCalledWith(5)
    expect(result).toEqual({ id: 5, items: [] })
    expect(get(store.linkTree)).toEqual({ id: 5, items: [] })

    store.resetLinkTree()
    expect(get(store.linkTree)).toBeNull()
  })

  it('addLinkTree mengembalikan id baru', async () => {
    api.createLinkTree.mockResolvedValue({ data: { link_tree_id: 7 } })
    await expect(store.addLinkTree({ title: 'A' })).resolves.toBe(7)
  })
})

const mutations = [
  ['addLinkTree', 'createLinkTree', [{ title: 'a' }], 'adding'],
  ['changeLinkTree', 'updateLinkTree', [1, { title: 'a' }], 'changing'],
  ['changeLinkTreeCover', 'changeCover', [1, file], 'changingCover'],
  ['removeLinkTree', 'deleteLinkTree', [1], 'deleting'],
  ['removeAllLinkTrees', 'deleteAllLinkTrees', [], 'deletingAll'],
  ['addItem', 'createItem', [1, { title: 'a', url: 'https://a.test' }], 'mutatingItem'],
  ['changeItem', 'updateItem', [1, 2, { title: 'a', url: 'https://a.test' }], 'mutatingItem'],
  ['removeItem', 'deleteItem', [1, 2], 'mutatingItem']
]

describe.each(mutations)('linkTreesStore %s', (action, apiName, args, flag) => {
  it('menyalakan bendera selama proses lalu mematikannya', async () => {
    const pending = deferred()
    api[apiName].mockReturnValue(pending.promise)
    const promise = store[action](...args)
    expect(get(store[flag])).toBe(true)
    expect(api[apiName]).toHaveBeenCalledWith(...args)
    pending.resolve({ data: { link_tree_id: 7 } })
    await promise
    expect(get(store[flag])).toBe(false)
  })

  it('mematikan bendera dan meneruskan error saat gagal', async () => {
    api[apiName].mockRejectedValue(new Error('gagal'))
    await expect(store[action](...args)).rejects.toThrow('gagal')
    expect(get(store[flag])).toBe(false)
  })
})
