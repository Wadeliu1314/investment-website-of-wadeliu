'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProject } from '@/lib/storage'
import { getInvestmentDecision, generateAssessmentReport } from '@/lib/calculator'
import { DIMENSIONS } from '@/lib/types'
import { type Project } from '@/lib/types'

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [reportContent, setReportContent] = useState('')
  
  useEffect(() => {
    const proj = getProject(projectId)
    if (proj) {
      setProject(proj)
      setReportContent(generateAssessmentReport(proj))
    }
  }, [projectId])
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 mb-4">项目不存在</p>
          <Link href="/projects" className="btn btn-primary">
            返回项目库
          </Link>
        </div>
      </div>
    )
  }
  
  const decision = getInvestmentDecision(project.totalScore)
  
  // 下载报告
  const handleDownload = (format: 'md' | 'txt') => {
    let content = reportContent
    if (format === 'txt') {
      content = reportContent.replace(/^# /gm, '').replace(/^## /gm, '\n').replace(/^### /gm, '\n  ')
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name}-投资评估报告.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // 打印报告
  const handlePrint = () => {
    window.print()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/projects/${project.id}`} className="text-2xl">←</Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">投资分析报告</h1>
                <p className="text-sm text-gray-500">{project.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDownload('md')} className="btn btn-secondary">
                📥 下载MD
              </button>
              <button onClick={() => handleDownload('txt')} className="btn btn-secondary">
                📥 下载TXT
              </button>
              <button onClick={handlePrint} className="btn btn-primary">
                🖨️ 打印
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* 报告内容 - 可打印区域 */}
        <div className="card bg-white p-8 max-w-4xl mx-auto print:p-0" id="report-content">
          {/* 报告头部 */}
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              投资评估报告
            </h1>
            <p className="text-gray-500">
              {project.name} - {project.company}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              评估日期：{new Date(project.createdAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
          
          {/* 投资决策 */}
          <div 
            className="p-6 rounded-lg mb-6"
            style={{ backgroundColor: decision.color + '15', borderLeft: `4px solid ${decision.color}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">投资决策</div>
                <div className="text-3xl font-bold" style={{ color: decision.color }}>
                  {decision.decision}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">综合评分</div>
                <div className="text-4xl font-bold" style={{ color: decision.color }}>
                  {project.totalScore}
                  <span className="text-lg font-normal">/10</span>
                </div>
                <div className="text-sm text-gray-500">
                  {(project.totalScore * 10).toFixed(0)}/100
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm" style={{ color: decision.color }}>
              {decision.reason}
            </div>
          </div>
          
          {/* 项目基本信息 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">一、项目基本信息</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500 w-32">项目名称</td>
                  <td className="py-2 font-medium">{project.name}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">公司名称</td>
                  <td className="py-2 font-medium">{project.company}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">融资阶段</td>
                  <td className="py-2 font-medium">{project.stage}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">行业</td>
                  <td className="py-2 font-medium">{project.industry}</td>
                </tr>
                {project.contact && (
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-500">联系方式</td>
                    <td className="py-2 font-medium">{project.contact}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* 评估结果汇总 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">二、评估结果汇总</h2>
            <div className="grid grid-cols-4 gap-4">
              {DIMENSIONS.map(dim => {
                const score = project.scores[dim.id] || 0
                return (
                  <div key={dim.id} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{dim.icon}</div>
                    <div className="text-sm text-gray-500 mb-1">{dim.name}</div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {score}
                    </div>
                    <div className="text-xs text-gray-400">权重{dim.weight}%</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* 各维度详细评估 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">三、各维度详细评估</h2>
            
            {DIMENSIONS.map(dim => {
              const score = project.scores[dim.id] || 0
              return (
                <div key={dim.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{dim.icon}</span>
                      <span className="font-semibold">{dim.name}</span>
                      <span className="text-sm text-gray-500">（权重{dim.weight}%）</span>
                    </div>
                    <div 
                      className="text-xl font-bold"
                      style={{ 
                        color: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {score}/10
                    </div>
                  </div>
                  
                  {/* 评分进度条 */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${score * 10}%`,
                        backgroundColor: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {dim.indicators.map(ind => {
                      const indicatorScore = score || 5
                      return (
                        <div key={ind.id} className="flex justify-between py-1">
                          <span>{ind.name}</span>
                          <span>{indicatorScore}/10</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* 投资原则 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-bold text-blue-900 mb-2">📋 投资原则</h2>
            <div className="text-sm text-blue-800">
              <p>• 总分 ≥ 90分（百分制）：强烈推荐投资</p>
              <p>• 总分 70-89分（百分制）：推荐投资</p>
              <p>• 总分 &lt; 70分（百分制）：不投资</p>
              <p className="mt-2 font-medium">
                本项目得分：{(project.totalScore * 10).toFixed(0)}分 - {decision.decision}
              </p>
            </div>
          </div>
          
          {/* 备注 */}
          {project.notes && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">四、备注</h2>
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 whitespace-pre-wrap">
                {project.notes}
              </div>
            </div>
          )}
          
          {/* 报告底部 */}
          <div className="text-center pt-6 border-t border-gray-200 text-sm text-gray-400">
            <p>本报告由兔斯基的投资网站自动生成</p>
            <p>评估日期：{new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      </main>
      
      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content, #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
