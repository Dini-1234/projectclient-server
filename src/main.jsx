import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './components/context.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { UserProvider } from './UserContext';

// ReactDOM.render(
//   <React.StrictMode>
//     <UserProvider>
//       <App />
//     </UserProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
