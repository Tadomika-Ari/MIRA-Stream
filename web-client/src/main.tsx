// @ts-nocheck
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './home.tsx'
import Conn from './pages/connection.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conn" element={<Conn />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
