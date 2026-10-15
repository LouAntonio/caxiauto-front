import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { queryClient } from './services/queryClient'
import { initPixel } from './pixel'
import './index.css'
import App from './App.jsx'

// Pixel carregado uma vez, antes do primeiro render, para que já
// apanhe o PageView inicial da rota.
initPixel()

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<App />
			</GoogleOAuthProvider>
		</QueryClientProvider>
	</StrictMode>,
)
