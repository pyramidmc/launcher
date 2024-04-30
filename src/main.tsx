import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import TitleBar from './components/TitleBar.tsx'
const os = window.require('node:os')

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const theme = extendTheme({ colors })

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider theme={theme}>
      {os.platform() !== 'linux' && <TitleBar />}
      <App />
    </ChakraProvider>
)
