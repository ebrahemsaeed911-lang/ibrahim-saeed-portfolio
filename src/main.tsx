import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PortfolioProvider } from './data/use-portfolio-data'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </StrictMode>
)
