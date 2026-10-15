import { writable } from 'svelte/store'
import * as api from '../api/linkTreeApi.js'

export const linkTrees = writable([])
export const linkTree = writable(null)

export const loading = writable(false)
export const adding = writable(false)
export const changing = writable(false)
export const changingCover = writable(false)
export const deleting = writable(false)
export const deletingAll = writable(false)
export const mutatingItem = writable(false)

const track = async (flag, task) => {
  flag.set(true)
  try {
    return await task()
  } finally {
    flag.set(false)
  }
}

export const fetchLinkTrees = (isMe) =>
  track(loading, async () => {
    const response = await api.getLinkTrees(isMe)
    linkTrees.set(response.data.link_trees)
    return response.data.link_trees
  })

export const fetchLinkTree = (id) =>
  track(loading, async () => {
    const response = await api.getLinkTree(id)
    linkTree.set(response.data.link_tree)
    return response.data.link_tree
  })

export const resetLinkTree = () => linkTree.set(null)

export const addLinkTree = (payload) =>
  track(adding, async () => {
    const response = await api.createLinkTree(payload)
    return response.data.link_tree_id
  })

export const changeLinkTree = (id, payload) =>
  track(changing, () => api.updateLinkTree(id, payload))

export const changeLinkTreeCover = (id, file) =>
  track(changingCover, () => api.changeCover(id, file))

export const removeLinkTree = (id) => track(deleting, () => api.deleteLinkTree(id))

export const removeAllLinkTrees = () => track(deletingAll, () => api.deleteAllLinkTrees())

export const addItem = (id, payload) => track(mutatingItem, () => api.createItem(id, payload))

export const changeItem = (id, itemId, payload) =>
  track(mutatingItem, () => api.updateItem(id, itemId, payload))

export const removeItem = (id, itemId) =>
  track(mutatingItem, () => api.deleteItem(id, itemId))
