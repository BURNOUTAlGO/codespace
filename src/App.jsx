import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Start'
import Room from './pages/Room'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/s/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App