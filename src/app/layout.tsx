import './globals.css'

import {
  Inter,
  Poppins,
  Merriweather,
  Playfair_Display,
  JetBrains_Mono,
} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable}
        ${poppins.variable}
        ${merriweather.variable}
        ${playfair.variable}
        ${jetbrains.variable}
      `}
    >
      <body>{children}</body>
    </html>
  )
}