import api from './api'

export const getBooks = async () => {
  const { data } = await api.get('/books')
  return data
}

export const getBook = async (id) => {
  const { data } = await api.get(`/books/${id}`)
  return data
}

export const createBook = async (payload) => {
  const { data } = await api.post('/books', payload)
  return data
}

export const updateBook = async (id, payload) => {
  const { data } = await api.put(`/books/${id}`, payload)
  return data
}

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`)
  return data
}

export const getCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload)
  return data
}
