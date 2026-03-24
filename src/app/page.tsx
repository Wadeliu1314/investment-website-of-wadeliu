'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/lib/store'
import { calculateProjectStats, getInvestmentDecision } from '@/lib/calculator'
import { DIMENSIONS, PIPELINE_STAGES } from '@/lib/types'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#00B26A', '#1E88E5', '#F59E0B', '#EF4444']

export default function HomePage() {
  const { projects, initialize } = useProjectStore()
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    initialize()
  }, [initialize])
  
  useEffect(() => {
    setStats(calculateProjectStats(projects))
  }, [projects])
  
  if (!stats) return null
  
  const recentProjects = projects.slice(0, 5)
  
  // 评分分布数据
  const scoreDistributionData = [
    { name: '优秀(9-10)', value: stats.scoreDistribution.excellent, color: '#00B26A' },
    { name: '良好(7-8.9)', value: stats.scoreDistribution.good, color: '#1E88E5' },
    { name: '一般(5-6.9)', value: stats.scoreDistribution.fair, color: '#F59E0B' },
    { name: '较差(<5)', value: stats.scoreDistribution.poor, color: '#EF4444' }
  ].filter(item => item.value > 0)
  
  // 行业分布数据
  const industryData = Object.entries(stats.byIndustry).map(([name, value]) => ({
    name,
    value
  }))
  
  // Pipeline数据
  const pipelineData = PIPELINE_STAGES.map(stage => ({
    name: stage.label,
    value: stats.byPipelineStatus[stage.id] || 0,
    color: stage.color
  })).filter(item => item.value > 0)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🐻 兔斯基的投资网站</h1>
              <p className="text-sm text-gray-500">硬科技投资评估与管理平台</p>
            </div>
            <div className="flex gap-3">
              <Link href="/projects/new" className="btn btn-primary">
                + 新建评估
              </Link>
              <Link href="/projects" className="btn btn-secondary">
                项目库
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* 欢迎区域 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            欢迎回来！
          </h2>
          <p className="text-gray-500">
            今天是 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">总项目数</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">个项目</div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">平均评分</div>
            <div className="text-3xl font-bold text-gray-900">{stats.averageScore}</div>
            <div className="text-xs text-gray-400 mt-1">分</div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">推荐投资</div>
            <div className="text-3xl font-bold text-green-600">{stats.recommended}</div>
            <div className="text-xs text-gray-400 mt-1">个项目</div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">不投资</div>
            <div className="text-3xl font-bold text-red-600">{stats.notRecommended}</div>
            <div className="text-xs text-gray-400 mt-1">个项目</div>
          </div>
        </div>
        
        {/* 图表区域 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 评分分布 */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">评分分布</h3>
            {scoreDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                暂无数据
              </div>
            )}
          </div>
          
          {/* 行业分布 */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">行业分布</h3>
            {industryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                暂无数据
              </div>
            )}
          </div>
        </div>
        
        {/* Pipeline漏斗 */}
        {pipelineData.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Pipeline 状态</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* 最近项目 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🔥 最近评估</h3>
            <Link href="/projects" className="text-sm text-blue-600 hover:underline">
              查看全部 →
            </Link>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map(project => {
                const decision = getInvestmentDecision(project.totalScore)
                const percentage = (project.totalScore * 10).toFixed(0)
                
                return (
                  <Link 
                    key={project.id} 
                    href={`/projects/${project.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.company}</div>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: decision.color }}
                        >
                          {project.totalScore}分
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: decision.color }}
                        >
                          {decision.decision}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {project.stage}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {project.industry}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">还没有评估项目</p>
              <Link href="/projects/new" className="btn btn-primary">
                开始第一个评估
              </Link>
            </div>
          )}
        </div>
        
        {/* 投资原则提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📋</div>
            <div>
              <div className="font-semibold text-blue-900 mb-1">投资原则</div>
              <div className="text-sm text-blue-700">
                总分低于 <span className="font-bold">70分</span> 的项目，不予投资
              </div>
              <div className="text-xs text-blue-600 mt-1">
                ≥90分：强烈推荐投资 | 70-89分：推荐投资 | &lt;70分：不投资
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
