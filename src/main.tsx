import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Comment ./App.css to use Material UI
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
