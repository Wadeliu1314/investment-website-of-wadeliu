'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/lib/store'
import { filterProjects, sortProjects } from '@/lib/storage'
import { getInvestmentDecision } from '@/lib/calculator'
import { STAGES, INDUSTRIES, PIPELINE_STAGES } from '@/lib/types'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, initialize, deleteProject, exportProjectsJSON, exportProjectsCSV } = useProjectStore()
  
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [pipelineFilter, setPipelineFilter] = useState('')
  const [scoreFilter, setScoreFilter] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'totalScore' | 'name'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showExportMenu, setShowExportMenu] = useState(false)
  
  useEffect(() => {
    initialize()
  }, [initialize])
  
  // 筛选和排序
  const filteredProjects = sortProjects(
    filterProjects(projects, {
      stage: stageFilter || undefined,
      industry: industryFilter || undefined,
      pipelineStatus: pipelineFilter || undefined,
      keyword: search || undefined,
      minScore: scoreFilter === 'high' ? 7 : scoreFilter === 'low' ? 0 : undefined,
      maxScore: scoreFilter === 'high' ? 10 : scoreFilter === 'low' ? 7 : undefined
    }),
    sortBy,
    sortOrder
  )
  
  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除项目"${name}"吗？`)) {
      deleteProject(id)
    }
  }
  
  const handleExportJSON = () => {
    const data = exportProjectsJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investment-projects-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }
  
  const handleExportCSV = () => {
    const data = exportProjectsCSV()
    const blob = new Blob([data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investment-projects-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl">←</Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">项目库</h1>
                <p className="text-sm text-gray-500">共 {projects.length} 个项目</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  📥 导出
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button 
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={handleExportJSON}
                    >
                      导出 JSON
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={handleExportCSV}
                    >
                      导出 CSV
                    </button>
                  </div>
                )}
              </div>
              <Link href="/projects/new" className="btn btn-primary">
                + 新建评估
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* 搜索和筛选 */}
        <div className="card mb-6">
          <div className="grid grid-cols-5 gap-4">
            {/* 搜索 */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="搜索项目..."
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* 融资阶段筛选 */}
            <select
              className="select"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">全部阶段</option>
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            
            {/* 行业筛选 */}
            <select
              className="select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">全部行业</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            
            {/* 评分筛选 */}
            <select
              className="select"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="">全部评分</option>
              <option value="high">≥7分（推荐）</option>
              <option value="low">&lt;7分（不推荐）</option>
            </select>
          </div>
          
          {/* 排序 */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">排序：</span>
            <select
              className="select w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="createdAt">创建时间</option>
              <option value="updatedAt">更新时间</option>
              <option value="totalScore">评分</option>
              <option value="name">名称</option>
            </select>
            <button
              className="btn btn-secondary"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? '↓ 降序' : '↑ 升序'}
            </button>
            
            <span className="text-sm text-gray-500 ml-auto">
              筛选结果：{filteredProjects.length} 个项目
            </span>
          </div>
        </div>
        
        {/* 项目列表 */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-3">
            {filteredProjects.map(project => {
              const decision = getInvestmentDecision(project.totalScore)
              
              return (
                <div key={project.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
                          style={{ 
                            backgroundColor: decision.color + '20',
                            color: decision.color
                          }}
                        >
                          {project.totalScore}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500">{project.company}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {project.stage}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {project.industry}
                            </span>
                            {project.pipelineStatus && (
                              <span 
                                className="text-xs px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: PIPELINE_STAGES.find(s => s.id === project.pipelineStatus)?.color + '20',
                                  color: PIPELINE_STAGES.find(s => s.id === project.pipelineStatus)?.color
                                }}
                              >
                                {project.pipelineStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="text-right">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: decision.color }}
                      >
                        {project.totalScore}
                        <span className="text-sm font-normal text-gray-400">分</span>
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: decision.color }}
                      >
                        {decision.decision}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="btn btn-secondary text-sm"
                    >
                      查看详情
                    </Link>
                    <Link 
                      href={`/projects/${project.id}/report`}
                      className="btn btn-secondary text-sm"
                    >
                      生成报告
                    </Link>
                    <button 
                      className="btn btn-danger text-sm ml-auto"
                      onClick={() => handleDelete(project.id, project.name)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500 mb-4">没有找到符合条件的项目</p>
            <Link href="/projects/new" className="btn btn-primary">
              新建评估
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
