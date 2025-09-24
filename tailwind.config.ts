import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kuusou: {
          pink: '#FF6FB5',
          sky: '#9BE7FF',
          night: '#0B0F14',
          card: '#121823'
        }
      },
      borderRadius: { '2xl': '1rem' }
    }
  },
  plugins: []
} satisfies Config
