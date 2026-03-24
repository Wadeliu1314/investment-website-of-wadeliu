'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProjectStore } from '@/lib/store'
import { calculateDimensionScore, calculateTotalScore, getInvestmentDecision } from '@/lib/calculator'
import { DIMENSIONS, STAGES, INDUSTRIES, PIPELINE_STAGES } from '@/lib/types'

export default function NewProjectPage() {
  const router = useRouter()
  const { createProject } = useProjectStore()
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    stage: '天使轮',
    industry: 'AI芯片',
    pipelineStatus: '接触' as string,
    contact: '',
    description: '',
    notes: ''
  })
  
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [decision, setDecision] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  
  // 初始化评分
  useEffect(() => {
    const initialScores: Record<string, Record<string, number>> = {}
    DIMENSIONS.forEach(dim => {
      initialScores[dim.id] = {}
      dim.indicators.forEach(ind => {
        initialScores[dim.id][ind.id] = 5
      })
    })
    setScores(initialScores)
  }, [])
  
  // 实时计算
  useEffect(() => {
    if (Object.keys(scores).length === 0) return
    
    const dimensionScores: Record<string, number> = {}
    DIMENSIONS.forEach(dim => {
      dimensionScores[dim.id] = calculateDimensionScore(scores[dim.id])
    })
    
    const total = calculateTotalScore(dimensionScores)
    setTotalScore(total)
    setDecision(getInvestmentDecision(total))
  }, [scores])
  
  const handleScoreChange = (dimensionId: string, indicatorId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [dimensionId]: {
        ...prev[dimensionId],
        [indicatorId]: value
      }
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.company) {
      alert('请填写项目名称和公司名称')
      return
    }
    
    setSaving(true)
    
    const dimensionScores: Record<string, number> = {}
    DIMENSIONS.forEach(dim => {
      dimensionScores[dim.id] = calculateDimensionScore(scores[dim.id])
    })
    
    const project = {
      ...formData,
      scores: scores,
      totalScore,
      advice: decision?.decision || '未评估'
    }
    
    createProject(project)
    
    setSaving(false)
    router.push('/projects')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects" className="text-2xl">←</Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">新建项目评估</h1>
                <p className="text-sm text-gray-500">填写项目信息和8维度评估</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* 项目基本信息 */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">📋 项目基本信息</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="输入项目名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="输入公司名称"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  融资阶段
                </label>
                <select
                  className="select"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  {STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  行业
                </label>
                <select
                  className="select"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                >
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline状态
                </label>
                <select
                  className="select"
                  value={formData.pipelineStatus}
                  onChange={(e) => setFormData({ ...formData, pipelineStatus: e.target.value })}
                >
                  {PIPELINE_STAGES.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系方式
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="电话或邮箱"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目描述
              </label>
              <textarea
                className="input"
                rows={2}
                placeholder="简单描述项目..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          
          {/* 8维度评估 */}
          {DIMENSIONS.map(dimension => (
            <div key={dimension.id} className="card mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {dimension.icon} {dimension.name} ({dimension.weight}%)
              </h2>
              
              <div className="space-y-4">
                {dimension.indicators.map(indicator => (
                  <div key={indicator.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{indicator.name}</div>
                        <div className="text-xs text-gray-500">{indicator.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-lg font-bold"
                          style={{ 
                            color: scores[dimension.id]?.[indicator.id] >= 7 ? '#10b981' : 
                                   scores[dimension.id]?.[indicator.id] >= 5 ? '#f59e0b' : '#ef4444'
                          }}
                        >
                          {scores[dimension.id]?.[indicator.id] || 5}
                        </span>
                        <span className="text-xs text-gray-400">分</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={scores[dimension.id]?.[indicator.id] || 5}
                      onChange={(e) => handleScoreChange(dimension.id, indicator.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* 实时评分结果 */}
          {decision && (
            <div className="card mb-6" style={{ borderLeftColor: decision.color, borderLeftWidth: '4px' }}>
              <h2 className="text-lg font-semibold mb-4">📊 实时评分结果</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">综合评分</div>
                  <div className="text-4xl font-bold" style={{ color: decision.color }}>
                    {totalScore}
                    <span className="text-lg font-normal text-gray-400">/10</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    百分制：{(totalScore * 10).toFixed(0)}/100
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl mb-2">{decision.icon}</div>
                  <div className="text-xl font-bold" style={{ color: decision.color }}>
                    {decision.decision}
                  </div>
                  <div className="text-sm text-gray-500 mt-2 max-w-xs">
                    {decision.reason}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 备注 */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">📝 备注</h2>
            <textarea
              className="input"
              rows={3}
              placeholder="添加备注..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          
          {/* 提交按钮 */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? '保存中...' : '💾 保存评估'}
            </button>
            <Link href="/projects" className="btn btn-secondary">
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
