import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/global.scss'
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#4d53e8',
                borderRadius: 6,
                borderRadiusSM: 6,
                controlHeightSM: 28,
                contentFontSizeSM: 13
            },
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ConfigProvider>
  ,
)

