import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBook, createBook, updateBook, getCategories } from '../../services/books'

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
    category_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoadError(null)

    // Tải danh sách chuyên ngành trước
    getCategories().then((cats) => {
      if (!cancelled) {
        setCategories(cats)
        if (cats.length > 0 && !form.category_id) {
            setForm(prev => ({...prev, category_id: cats[0].id})) // Chọn mặc định cái đầu tiên
        }
      }
    }).catch((e) => {
        if (!cancelled) setLoadError('Không thể tải danh sách chuyên ngành')
    })

    // Nếu là chế độ Sửa, tải thông tin sách
    if (isEdit) {
      getBook(id)
        .then((b) => {
          if (!cancelled) {
            setForm({
              title: b.title,
              author: b.author,
              publisher: b.publisher,
              pages: b.pages,
              size: b.size,
              total_quantity: b.total_quantity,
              category_id: b.category_id
            })
          }
        })
        .catch((e) => {
          if (!cancelled) setLoadError(e.response?.data?.detail || e.message || 'Không tải được thông tin sách')
        })
    }
    
    return () => { cancelled = true }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!form.title?.trim() || !form.author?.trim() || !form.category_id) {
      setSubmitError('Vui lòng nhập đầy đủ Tên sách, Tác giả và chọn Chuyên ngành.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim(),
        pages: parseInt(form.pages) || 0,
        size: form.size.trim(),
        total_quantity: parseInt(form.total_quantity) || 1,
        category_id: parseInt(form.category_id)
      }

      if (isEdit) {
        await updateBook(id, payload)
        navigate('/books')
      } else {
        await createBook(payload)
        navigate('/books')
      }
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
        style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 12, background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
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
            {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ flex: 1 }}>
            Nhà xuất bản
            <input type="text" name="publisher" value={form.publisher} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
            </label>
            <label style={{ width: '100px' }}>
            Số trang
            <input type="number" name="pages" value={form.pages} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
            </label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ flex: 1 }}>
            Kích thước (VD: 14x20cm)
            <input type="text" name="size" value={form.size} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
            </label>
            
            {!isEdit && (
                <label style={{ width: '100px' }}>
                Số lượng nhập <span style={{ color: 'red' }}>*</span>
                <input type="number" name="total_quantity" min="1" value={form.total_quantity} onChange={handleChange} required style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }} />
                </label>
            )}
        </div>
        {!isEdit && <small style={{ color: '#666' }}>Hệ thống sẽ tự động tạo ra các Bản sao tương ứng với Số lượng nhập.</small>}

        {submitError && <p style={{ color: 'red', margin: 0 }}>{submitError}</p>}
        
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={loading || categories.length === 0} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: (loading || categories.length === 0) ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm Sách'}
          </button>
          <button type="button" onClick={() => navigate('/books')} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}