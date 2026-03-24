'use client'

import { useEffect, useState } from 'react'
import { useProjectStore } from '@/lib/store'

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const initialize = useProjectStore(state => state.initialize)
  
  useEffect(() => {
    initialize()
    setMounted(true)
  }, [initialize])
  
  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>加载中...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
