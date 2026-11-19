import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import Index from './routes/Index'
import './global.scss'

// every link and button blinks when clicked, like a macOS menu item; restarting the class replays it on fast repeat clicks
addEventListener('click', e => {
  const el = (e.target as Element).closest?.('a, button, [role="button"]')
  if (!el) return
  el.classList.remove('blink')
  void (el as HTMLElement).offsetWidth
  el.classList.add('blink')
  el.addEventListener('animationend', () => el.classList.remove('blink'), { once: true })
}, true)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          {/* one page: /proyecto/:slug only opens a sheet on top of it */}
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>,
)
