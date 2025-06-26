import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom';
import Chart from './pages/Chart'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="chart" element={<Chart />} />
          {/* Thêm các route khác ở đây nếu cần */}
        </Route>
      </Routes>

    </>
  )
}

export default App
