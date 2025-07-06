import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom';
import Chart from './pages/Chart'
import Calendar from './pages/Calendar';
import Home from './pages/Home';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chart" element={<Chart />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
