import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

// API cho Sách
export const getBooks = async () => {
  const response = await axios.get(`${API_URL}/books`)
  return response.data
}

export const getBook = async (id) => {
  const response = await axios.get(`${API_URL}/books/${id}`)
  return response.data
}

export const createBook = async (data) => {
  const response = await axios.post(`${API_URL}/books`, data)
  return response.data
}

export const updateBook = async (id, data) => {
  const response = await axios.put(`${API_URL}/books/${id}`, data)
  return response.data
}

export const deleteBook = async (id) => {
  const response = await axios.delete(`${API_URL}/books/${id}`)
  return response.data
}

// API cho Chuyên ngành (Dùng cho dropdown lúc chọn chuyên ngành cho sách)
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`)
  return response.data
}