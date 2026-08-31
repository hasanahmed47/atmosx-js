import '../app/globals.css'

export const metadata = {
  title: 'AtmosX',
  description: 'Real-time weather intelligence',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
