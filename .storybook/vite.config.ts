import react from '@vitejs/plugin-react'
import { UserConfigExport } from 'vite'
import { defineConfig } from 'vitest/config'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
  })
}
// https://vitejs.dev/config/
export default app
