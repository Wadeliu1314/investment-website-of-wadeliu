import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ProjectProvider } from '@/components/ProjectProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '兔斯基的投资网站',
  description: '硬科技投资评估与管理平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  )
}
