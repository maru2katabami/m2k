import "./globals.css"
import { Source_Sans_3 } from "next/font/google"
import NextAuthProvider from "@/lib/nextauth"

const ss3 = Source_Sans_3({ subsets: ["latin"]})

export const metadata = {
  title: "maru2katabami",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ ss3.className }>
        <NextAuthProvider>
          { children }
        </NextAuthProvider>
      </body>
    </html>
  )
}
