import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReaderList from './pages/readers/ReaderList'
import ReaderForm from './pages/readers/ReaderForm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="readers" element={<ReaderList />} />
          <Route path="readers/new" element={<ReaderForm />} />
          <Route path="readers/:id/edit" element={<ReaderForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
