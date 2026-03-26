// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PollList } from './components/PollList'
import { CreatePoll } from './components/CreatePoll'
import { PollDetail } from './components/PollDetail'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollDetail />} />
      </Routes>
    </Router>
  )
}

export default App
