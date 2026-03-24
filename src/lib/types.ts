// 核心数据类型 - 与微信小程序完全一致

// 项目接口
export interface Project {
  id: string;
  name: string;
  company: string;
  stage: string;
  industry: string;
  scores: Record<string, number>;  // 8维度评分
  totalScore: number;               // 总分 (1-10)
  advice: string;                  // 投资建议
  createdAt: string;               // 创建时间
  updatedAt: string;               // 更新时间
  notes?: string;                  // 笔记
  
  // 扩展字段
  contact?: string;                // 联系方式
  description?: string;            // 项目描述
  website?: string;                // 官网
  tags?: string[];                 // 标签
  
  // 投资信息
  investmentAmount?: number;        // 投资金额
  equityPercentage?: number;        // 持股比例
  valuation?: number;               // 估值
  
  // Pipeline状态
  pipelineStatus?: PipelineStatus;  // Pipeline状态
  nextAction?: string;             // 下一步行动
  actionDate?: string;              // 行动日期
}

// Pipeline状态
export type PipelineStatus = 
  | '接触' 
  | '初次沟通' 
  | '尽调中' 
  | '投决会' 
  | '待打款' 
  | '已投资' 
  | '已放弃';

// 8维度定义
export const DIMENSIONS = [
  {
    id: 'technology',
    name: '技术维度',
    weight: 16,
    icon: '🔴',
    indicators: [
      { id: 'maturity', name: '技术成熟度', description: 'TRL等级' },
      { id: 'innovation', name: '技术创新度', description: '国际/国内领先度' },
      { id: 'barrier', name: '技术壁垒强度', description: '专利/工艺/算法/数据' },
      { id: 'substitution', name: '技术替代风险', description: '被新技术替代的风险' }
    ]
  },
  {
    id: 'product',
    name: '产品维度',
    weight: 15,
    icon: '🟠',
    indicators: [
      { id: 'pmf', name: '产品市场契合度', description: 'PMF' },
      { id: 'competitiveness', name: '产品竞争力', description: '相对竞争对手的优势' },
      { id: 'iteration', name: '产品迭代能力', description: '快速迭代的能力' },
      { id: 'commercialization', name: '产品商业化潜力', description: '盈利潜力' }
    ]
  },
  {
    id: 'market',
    name: '市场维度',
    weight: 15,
    icon: '🟡',
    indicators: [
      { id: 'size', name: '市场规模与增长', description: 'TAM/SAM/SOM' },
      { id: 'maturity', name: '市场成熟度', description: '发展阶段' },
      { id: 'policy', name: '市场政策支持', description: '国家战略支持' },
      { id: 'barrier', name: '市场进入壁垒', description: '进入难度' }
    ]
  },
  {
    id: 'competition',
    name: '竞争维度',
    weight: 12,
    icon: '🟢',
    indicators: [
      { id: 'landscape', name: '竞争格局', description: 'CR3集中度' },
      { id: 'strength', name: '竞争对手实力', description: '主要对手的实力' },
      { id: 'differentiation', name: '差异化优势', description: '相对竞争对手的优势' },
      { id: 'share', name: '市场份额潜力', description: '未来3-5年的份额增长' }
    ]
  },
  {
    id: 'team',
    name: '团队维度',
    weight: 12,
    icon: '🔵',
    indicators: [
      { id: 'founder', name: '创始人背景与能力', description: '履历和经验' },
      { id: 'completeness', name: '核心团队完整性', description: '角色完整性' },
      { id: 'execution', name: '团队执行力', description: '目标达成率' },
      { id: 'learning', name: '团队学习与成长', description: '学习能力' }
    ]
  },
  {
    id: 'organization',
    name: '组织维度',
    weight: 10,
    icon: '🟣',
    indicators: [
      { id: 'structure', name: '组织结构合理性', description: '结构清晰度' },
      { id: 'culture', name: '企业文化与价值观', description: '文化强度' },
      { id: 'talent', name: '人才吸引与保留', description: '人才能力' },
      { id: 'management', name: '管理体系与制度', description: '制度执行力' }
    ]
  },
  {
    id: 'financing',
    name: '融资周期与资本耐心度',
    weight: 10,
    icon: '🟤',
    indicators: [
      { id: 'cycle', name: '企业融资周期', description: '融资到盈利的周期' },
      { id: 'patience', name: '资本耐心度', description: '投资者的耐心程度' },
      { id: 'stability', name: '融资稳定性', description: '持续融资的能力' },
      { id: 'cash', name: '烧钱率与现金储备', description: '现金状况' }
    ]
  },
  {
    id: 'exit',
    name: '退出路径与流动性',
    weight: 10,
    icon: '⚫',
    indicators: [
      { id: 'ipo', name: 'IPO可能性与时间', description: '上市可能性' },
      { id: 'acquisition', name: '并购/战略融资可能性', description: '被并购的可能性' },
      { id: 'liquidity', name: '二级市场流动性', description: '股权流动性' },
      { id: 'matching', name: '基金存续期匹配度', description: '周期匹配程度' }
    ]
  }
] as const;

// 融资阶段选项
export const STAGES = [
  '种子轮',
  '天使轮',
  'Pre-A',
  'A轮',
  'B轮',
  'C轮',
  'D轮',
  'E轮+',
  '战略融资',
  '已上市'
] as const;

// 行业选项
export const INDUSTRIES = [
  'AI芯片',
  '大模型',
  'AI应用',
  '机器人',
  '太空AI',
  '卫星互联网',
  '量子计算',
  '商业航天',
  '新能源',
  '半导体',
  '医疗器械',
  '其他'
] as const;

// Pipeline阶段
export const PIPELINE_STAGES = [
  { id: '接触', label: '接触', color: '#9CA3AF' },
  { id: '初次沟通', label: '初次沟通', color: '#60A5FA' },
  { id: '尽调中', label: '尽调中', color: '#F59E0B' },
  { id: '投决会', label: '投决会', color: '#8B5CF6' },
  { id: '待打款', label: '待打款', color: '#EC4899' },
  { id: '已投资', label: '已投资', color: '#10B981' },
  { id: '已放弃', label: '已放弃', color: '#EF4444' }
] as const;

// 类型导出
export type Stage = typeof STAGES[number];
export type Industry = typeof INDUSTRIES[number];
export type DimensionId = typeof DIMENSIONS[number]['id'];
