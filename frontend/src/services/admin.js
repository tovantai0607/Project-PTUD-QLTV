import api from './api'

export async function getUsers() {
    const { data } = await api.get('/admin/users')
    return data
}

export async function createUser(payload) {
    const { data } = await api.post('/admin/users', payload)
    return data
}

export async function getTopBooksReport() {
    const { data } = await api.get('/admin/reports/top-books')
    return data
}