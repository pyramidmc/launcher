import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider, type ThemeConfig, extendTheme } from '@chakra-ui/react'
import TitleBar from './components/TitleBar.tsx'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
} as ThemeConfig
const theme = extendTheme({ colors, config })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <TitleBar />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
