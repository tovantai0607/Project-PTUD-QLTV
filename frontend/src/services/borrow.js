import api from './api'

export async function getAvailableCopies() {
  const { data } = await api.get('/borrow-system/available-copies')
  return data
}

export async function getBorrowedRecords() {
  const { data } = await api.get('/borrow-system/borrowed')
  return data
}

export async function borrowBook(params) {
  const { data } = await api.post('/borrow-system/borrow', null, { params })
  return data
}

export async function returnBorrowedBook(recordId) {
  const { data } = await api.post(`/borrow-system/return/${recordId}`)
  return data
}
