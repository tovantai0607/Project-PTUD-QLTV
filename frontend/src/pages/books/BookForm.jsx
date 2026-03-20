import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  createBook,
  createCategory,
  getBook,
  getCategories,
  updateBook,
} from '../../services/books'

export default function BookForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    pages: '',
    size: '',
    total_quantity: 1,
    category_id: '',
  })
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categoryError, setCategoryError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoadError(null)

    getCategories()
      .then((cats) => {
        if (!cancelled) {
          setCategories(cats)
          setForm((prev) => ({
            ...prev,
            category_id: prev.category_id || cats[0]?.id?.toString() || '',
          }))
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Không thể tải danh sách chuyên ngành')
      })

    if (isEdit) {
      getBook(id)
        .then((book) => {
          if (!cancelled) {
            setForm({
              title: book.title,
              author: book.author,
              publisher: book.publisher,
              pages: book.pages,
              size: book.size,
              total_quantity: book.total_quantity,
              category_id: book.category_id?.toString() || '',
            })
          }
        })
        .catch((e) => {
          if (!cancelled) setLoadError(e.response?.data?.detail || e.message || 'Không tải được thông tin sách')
        })
    }

    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
    setCategoryError(null)
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setCategoryError('Vui lòng nhập tên chuyên ngành.')
      return
    }

    setCategoryLoading(true)
    setCategoryError(null)
    try {
      const created = await createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
      })
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      setForm((prev) => ({ ...prev, category_id: created.id.toString() }))
      setNewCategory({ name: '', description: '' })
    } catch (e) {
      setCategoryError(e.response?.data?.detail || e.message || 'Không thể tạo chuyên ngành')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!form.title?.trim() || !form.author?.trim() || !form.category_id) {
      setSubmitError('Vui lòng nhập đầy đủ tên sách, tác giả và chọn chuyên ngành.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim(),
        pages: parseInt(form.pages, 10) || 0,
        size: form.size.trim(),
        total_quantity: parseInt(form.total_quantity, 10) || 1,
        category_id: parseInt(form.category_id, 10),
      }

      if (isEdit) {
        await updateBook(id, payload)
      } else {
        await createBook(payload)
      }
      navigate('/books')
    } catch (e) {
      const msg = e.response?.data?.detail
      setSubmitError(Array.isArray(msg) ? msg.map((x) => x.msg).join(', ') : msg || e.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (loadError) return <p style={{ color: 'red' }}>{loadError}</p>

  return (
    <div>
      <h1>{isEdit ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 560,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'white',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <label>
          Tên sách <span style={{ color: 'red' }}>*</span>
          <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
        </label>

        <label>
          Tác giả <span style={{ color: 'red' }}>*</span>
          <input type="text" name="author" value={form.author} onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
        </label>

        <label>
          Chuyên ngành <span style={{ color: 'red' }}>*</span>
          <select name="category_id" value={form.category_id} onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="" disabled>-- Chọn chuyên ngành --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        {categories.length === 0 && <small style={{ color: '#b45309' }}>Chưa có chuyên ngành nào. Hãy tạo mới ngay bên dưới trước khi lưu sách.</small>}

        <div style={{ padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0 }}>Thêm chuyên ngành mới</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              Tên chuyên ngành
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleCategoryChange}
                style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
              />
            </label>
            <label>
              Mô tả
              <input
                type="text"
                name="description"
                value={newCategory.description}
                onChange={handleCategoryChange}
                style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
              />
            </label>
            {categoryError && <p style={{ color: 'red', margin: 0 }}>{categoryError}</p>}
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={categoryLoading}
              style={{ alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 6, border: '1px solid #2563eb', color: '#2563eb', background: 'white', cursor: categoryLoading ? 'not-allowed' : 'pointer' }}
            >
              {categoryLoading ? 'Đang tạo...' : 'Thêm chuyên ngành'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            Nhà xuất bản
            <input type="text" name="publisher" value={form.publisher} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>
          <label style={{ width: 120 }}>
            Số trang
            <input type="number" name="pages" value={form.pages} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            Kích thước
            <input type="text" name="size" value={form.size} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
          </label>

          {!isEdit && (
            <label style={{ width: 120 }}>
              Số lượng nhập <span style={{ color: 'red' }}>*</span>
              <input type="number" name="total_quantity" min="1" value={form.total_quantity} onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
            </label>
          )}
        </div>
        {!isEdit && <small style={{ color: '#666' }}>Hệ thống sẽ tự động tạo các bản sao tương ứng với số lượng nhập.</small>}

        {submitError && <p style={{ color: 'red', margin: 0 }}>{submitError}</p>}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm sách'}
          </button>
          <button type="button" onClick={() => navigate('/books')} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
