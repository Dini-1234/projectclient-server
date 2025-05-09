import { createRoot } from 'react-dom/client'
import { UserProvider } from './components/context.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
)