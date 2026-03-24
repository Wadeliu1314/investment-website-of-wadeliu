// 本地存储工具 - 支持浏览器LocalStorage和IndexedDB

import { type Project } from './types';

const STORAGE_KEY = 'investment_projects';

/**
 * 获取所有项目 - 从LocalStorage
 */
export const getAllProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取项目失败:', error);
    return [];
  }
};

/**
 * 保存项目
 */
export const saveProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  const projects = getAllProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  return newProject;
};

/**
 * 更新项目
 */
export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects[index];
};

/**
 * 删除项目
 */
export const deleteProject = (id: string): boolean => {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * 获取单个项目
 */
export const getProject = (id: string): Project | null => {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
};

/**
 * 搜索项目
 */
export const searchProjects = (keyword: string): Project[] => {
  const projects = getAllProjects();
  const lowerKeyword = keyword.toLowerCase();
  
  return projects.filter(p =>
    p.name.toLowerCase().includes(lowerKeyword) ||
    p.company.toLowerCase().includes(lowerKeyword) ||
    p.industry.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * 按条件筛选项目
 */
export const filterProjects = (
  projects: Project[],
  filters: {
    stage?: string;
    industry?: string;
    pipelineStatus?: string;
    minScore?: number;
    maxScore?: number;
    keyword?: string;
  }
): Project[] => {
  return projects.filter(p => {
    if (filters.stage && p.stage !== filters.stage) return false;
    if (filters.industry && p.industry !== filters.industry) return false;
    if (filters.pipelineStatus && p.pipelineStatus !== filters.pipelineStatus) return false;
    if (filters.minScore !== undefined && p.totalScore < filters.minScore) return false;
    if (filters.maxScore !== undefined && p.totalScore > filters.maxScore) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      if (!p.name.toLowerCase().includes(keyword) && 
          !p.company.toLowerCase().includes(keyword) &&
          !p.industry.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    return true;
  });
};

/**
 * 排序项目
 */
export const sortProjects = (
  projects: Project[], 
  sortBy: 'createdAt' | 'updatedAt' | 'totalScore' | 'name' = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
): Project[] => {
  return [...projects].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    } else if (sortBy === 'totalScore') {
      comparison = a.totalScore - b.totalScore;
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
};

/**
 * 导出项目为JSON（小程序兼容格式）
 */
export const exportToJSON = (): string => {
  const projects = getAllProjects();
  return JSON.stringify(projects, null, 2);
};

/**
 * 从JSON导入项目
 */
export const importFromJSON = (json: string): number => {
  try {
    const imported = JSON.parse(json);
    if (!Array.isArray(imported)) {
      throw new Error('Invalid format');
    }
    
    const existingProjects = getAllProjects();
    const existingIds = new Set(existingProjects.map(p => p.id));
    
    let addedCount = 0;
    imported.forEach((project: Project) => {
      if (!existingIds.has(project.id)) {
        existingProjects.push(project);
        addedCount++;
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProjects));
    return addedCount;
  } catch (error) {
    console.error('导入失败:', error);
    return 0;
  }
};

/**
 * 导出为CSV
 */
export const exportToCSV = (): string => {
  const projects = getAllProjects();
  
  const headers = ['项目名称', '公司名称', '融资阶段', '行业', '总分', '百分制', '投资决策', '创建日期', 'Pipeline状态'];
  
  const rows = [headers.join(',')];
  
  projects.forEach(project => {
    const percentage = (project.totalScore * 10).toFixed(0);
    const decision = percentage >= 70 ? '推荐投资' : '不投资';
    
    const row = [
      `"${project.name}"`,
      `"${project.company}"`,
      project.stage,
      project.industry,
      project.totalScore,
      percentage,
      decision,
      new Date(project.createdAt).toLocaleDateString(),
      project.pipelineStatus || ''
    ];
    
    rows.push(row.join(','));
  });
  
  return rows.join('\n');
};

/**
 * 清空所有项目
 */
export const clearAllProjects = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * 获取项目数量
 */
export const getProjectCount = (): number => {
  return getAllProjects().length;
};
