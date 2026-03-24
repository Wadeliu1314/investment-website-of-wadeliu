'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useProjectStore } from '@/lib/store'
import { getInvestmentDecision, calculateProjectStats } from '@/lib/calculator'
import { DIMENSIONS, PIPELINE_STAGES } from '@/lib/types'
import { getProject } from '@/lib/storage'
import { type Project } from '@/lib/types'
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const { projects, initialize, updateProject, deleteProject } = useProjectStore()
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState('')
  
  useEffect(() => {
    initialize()
  }, [initialize])
  
  useEffect(() => {
    const proj = getProject(projectId)
    if (proj) {
      setProject(proj)
      setNotes(proj.notes || '')
    }
  }, [projectId, projects])
  
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
  
  // 雷达图数据
  const radarData = DIMENSIONS.map(dim => ({
    dimension: dim.name,
    score: project.scores[dim.id] || 0,
    fullMark: 10
  }))
  
  // 各维度柱状图数据
  const barData = DIMENSIONS.map(dim => ({
    name: dim.name,
    score: project.scores[dim.id] || 0,
    weight: dim.weight,
    fullMark: 10
  }))
  
  const handleSaveNotes = () => {
    updateProject(project.id, { notes })
    setIsEditing(false)
  }
  
  const handleDelete = () => {
    if (confirm(`确定要删除项目"${project.name}"吗？`)) {
      deleteProject(project.id)
      router.push('/projects')
    }
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
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">{project.company}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/projects/${project.id}/report`} className="btn btn-primary">
                📄 生成报告
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                🗑️ 删除
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* 基本信息 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* 左侧：基本信息 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">📋 项目信息</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">项目名称</div>
                <div className="font-medium">{project.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">公司名称</div>
                <div className="font-medium">{project.company}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">融资阶段</div>
                <div className="font-medium">{project.stage}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">行业</div>
                <div className="font-medium">{project.industry}</div>
              </div>
              {project.pipelineStatus && (
                <div>
                  <div className="text-xs text-gray-500">Pipeline状态</div>
                  <div 
                    className="inline-block px-2 py-1 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: PIPELINE_STAGES.find(s => s.id === project.pipelineStatus)?.color + '20',
                      color: PIPELINE_STAGES.find(s => s.id === project.pipelineStatus)?.color
                    }}
                  >
                    {project.pipelineStatus}
                  </div>
                </div>
              )}
              {project.contact && (
                <div>
                  <div className="text-xs text-gray-500">联系方式</div>
                  <div className="font-medium">{project.contact}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">创建时间</div>
                <div className="font-medium">{new Date(project.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">更新时间</div>
                <div className="font-medium">{new Date(project.updatedAt).toLocaleString()}</div>
              </div>
            </div>
            
            {project.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">项目描述</div>
                <div className="text-sm">{project.description}</div>
              </div>
            )}
          </div>
          
          {/* 中间：评分结果 */}
          <div className="card" style={{ borderLeftColor: decision.color, borderLeftWidth: '4px' }}>
            <h2 className="text-lg font-semibold mb-4">📊 评估结果</h2>
            
            <div className="text-center mb-4">
              <div 
                className="text-5xl font-bold mb-2"
                style={{ color: decision.color }}
              >
                {project.totalScore}
              </div>
              <div className="text-gray-500">综合评分 (1-10)</div>
            </div>
            
            <div className="text-center mb-4">
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: decision.color }}
              >
                {(project.totalScore * 10).toFixed(0)}
              </div>
              <div className="text-gray-500">百分制 (0-100)</div>
            </div>
            
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: decision.color + '20' }}>
              <div className="text-2xl mb-2">{decision.icon}</div>
              <div className="font-bold" style={{ color: decision.color }}>
                {decision.decision}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {decision.reason}
              </div>
            </div>
          </div>
          
          {/* 右侧：雷达图 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">🎯 维度评分</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} fontSize={10} />
                <Radar
                  name="评分"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 维度详情 */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">📈 各维度详细评分</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={100} fontSize={11} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <rect 
                    key={`bar-${index}`} 
                    fill={entry.score >= 7 ? '#10b981' : entry.score >= 5 ? '#f59e0b' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-4 gap-4">
            {DIMENSIONS.map(dim => {
              const score = project.scores[dim.id] || 0
              return (
                <div key={dim.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{dim.icon}</span>
                    <span className="text-sm font-medium">{dim.name}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ 
                    color: score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444' 
                  }}>
                    {score}
                    <span className="text-xs font-normal text-gray-400">/10</span>
                  </div>
                  <div className="text-xs text-gray-500">权重{(dim.weight)}%</div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* 笔记 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">📝 笔记</h2>
            <button 
              onClick={() => isEditing ? handleSaveNotes() : setIsEditing(true)}
              className="btn btn-secondary text-sm"
            >
              {isEditing ? '💾 保存' : '✏️ 编辑'}
            </button>
          </div>
          
          {isEditing ? (
            <textarea
              className="input"
              rows={5}
              placeholder="添加笔记..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
              {notes || '暂无笔记'}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
