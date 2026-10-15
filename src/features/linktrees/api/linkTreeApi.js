import { apiRequest } from '../../../helpers/apiHelper.js'

export const getLinkTrees = (isMe) => apiRequest(isMe ? '/link-trees?is_me=1' : '/link-trees')

export const getLinkTree = (id) => apiRequest(`/link-trees/${id}`)

export const createLinkTree = (payload) =>
  apiRequest('/link-trees', { method: 'POST', body: payload })

export const updateLinkTree = (id, payload) =>
  apiRequest(`/link-trees/${id}`, { method: 'PUT', body: payload })

export const changeCover = (id, file) => {
  const form = new FormData()
  form.append('cover', file)
  return apiRequest(`/link-trees/${id}/cover`, { method: 'POST', body: form })
}

export const deleteLinkTree = (id) => apiRequest(`/link-trees/${id}`, { method: 'DELETE' })

export const deleteAllLinkTrees = () => apiRequest('/link-trees', { method: 'DELETE' })

export const createItem = (id, payload) =>
  apiRequest(`/link-trees/${id}/items`, { method: 'POST', body: payload })

export const updateItem = (id, itemId, payload) =>
  apiRequest(`/link-trees/${id}/items/${itemId}`, { method: 'PUT', body: payload })

export const deleteItem = (id, itemId) =>
  apiRequest(`/link-trees/${id}/items/${itemId}`, { method: 'DELETE' })
