import React from 'react'
import ReactDOM from 'react-dom/client'

import './assets/global.scss'
import './assets/theme.css'
import App from "./App.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
  ,
)

