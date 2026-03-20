import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiUrl = process.env.API_URL || `http://localhost:${process.env.API_PORT || '4000'}`
const webPort = Number(process.env.WEB_PORT) || 3000

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: webPort,
		proxy: {
			'/api': {
				target: apiUrl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
})
