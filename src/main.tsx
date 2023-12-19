import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './routes/Index'
import './global.scss'
import '@fontsource-variable/montserrat'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index></Index>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
