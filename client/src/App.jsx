import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainLayout></MainLayout>
    </>
  )
}

export default App
