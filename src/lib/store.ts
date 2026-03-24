// 项目状态管理 - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Project } from './types';
import * as storage from './storage';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  
  // 初始化项目列表
  initialize: () => void;
  
  // 创建项目
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // 更新项目
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  // 删除项目
  deleteProject: (id: string) => void;
  
  // 批量导入项目
  importProjects: (json: string) => number;
  
  // 导出项目
  exportProjectsJSON: () => string;
  exportProjectsCSV: () => string;
  
  // 清空所有项目
  clearAllProjects: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      
      initialize: () => {
        const projects = storage.getAllProjects();
        set({ projects });
      },
      
      createProject: (project) => {
        const newProject = storage.saveProject(project);
        set({ projects: [newProject, ...get().projects] });
      },
      
      updateProject: (id, updates) => {
        const updated = storage.updateProject(id, updates);
        if (updated) {
          set({
            projects: get().projects.map(p => p.id === id ? updated : p)
          });
        }
      },
      
      deleteProject: (id) => {
        storage.deleteProject(id);
        set({
          projects: get().projects.filter(p => p.id !== id)
        });
      },
      
      importProjects: (json) => {
        const count = storage.importFromJSON(json);
        if (count > 0) {
          set({ projects: storage.getAllProjects() });
        }
        return count;
      },
      
      exportProjectsJSON: () => {
        return storage.exportToJSON();
      },
      
      exportProjectsCSV: () => {
        return storage.exportToCSV();
      },
      
      clearAllProjects: () => {
        storage.clearAllProjects();
        set({ projects: [] });
      }
    }),
    {
      name: 'investment-projects-storage'
    }
  )
);
