// 评分计算工具 - 与微信小程序完全一致

import { DIMENSIONS, type Project } from './types';

/**
 * 维度权重配置 - 与小程序一致
 */
export const DIMENSION_WEIGHTS = {
  technology: 0.16,      // 技术维度
  product: 0.15,         // 产品维度
  market: 0.15,          // 市场维度
  competition: 0.12,     // 竞争维度
  team: 0.12,            // 团队维度
  organization: 0.10,    // 组织维度
  financing: 0.10,       // 融资周期
  exit: 0.10             // 退出路径
};

/**
 * 计算单个维度的平均分
 */
export const calculateDimensionScore = (indicators: Record<string, number>): number => {
  const scores = Object.values(indicators);
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return parseFloat((sum / scores.length).toFixed(1));
};

/**
 * 计算总分 - 与小程序一致
 */
export const calculateTotalScore = (dimensionScores: Record<string, number>): number => {
  let totalScore = 0;
  
  for (const [dimensionId, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    const score = dimensionScores[dimensionId] || 0;
    totalScore += score * weight;
  }
  
  return parseFloat(totalScore.toFixed(1));
};

/**
 * 获取投资建议 - 与小程序一致
 */
export const getInvestmentAdvice = (score: number) => {
  if (score >= 9) {
    return {
      advice: '强烈推荐',
      color: '#00B26A',
      level: 5
    };
  }
  if (score >= 7) {
    return {
      advice: '推荐',
      color: '#1E88E5',
      level: 4
    };
  }
  if (score >= 5) {
    return {
      advice: '中立',
      color: '#FFA500',
      level: 3
    };
  }
  if (score >= 3) {
    return {
      advice: '谨慎',
      color: '#FF6B6B',
      level: 2
    };
  }
  return {
    advice: '不推荐',
    color: '#999999',
    level: 1
  };
};

/**
 * 获取投资决策 - 核心原则：总分低于70分的项目，不予投资
 */
export const getInvestmentDecision = (score: number) => {
  const scorePercentage = score * 10; // 转换为百分制
  
  if (scorePercentage < 70) {
    return {
      decision: '不投资',
      reason: `总分${score}分（${scorePercentage}%），低于投资线70分，不予投资`,
      color: '#FF6B6B',
      icon: '❌',
      level: 'reject'
    };
  }
  
  if (scorePercentage >= 90) {
    return {
      decision: '强烈推荐投资',
      reason: `总分${score}分（${scorePercentage}%），优秀项目，值得重点关注和投资`,
      color: '#00B26A',
      icon: '✅',
      level: 'strong_accept'
    };
  }
  
  if (scorePercentage >= 70) {
    return {
      decision: '推荐投资',
      reason: `总分${score}分（${scorePercentage}%），良好项目，值得投资`,
      color: '#1E88E5',
      icon: '✅',
      level: 'accept'
    };
  }
  
  return {
    decision: '不投资',
    reason: `总分${score}分（${scorePercentage}%），低于投资线70分，不予投资`,
    color: '#FF6B6B',
    icon: '❌',
    level: 'reject'
  };
};

/**
 * 获取评分等级
 */
export const getScoreLevel = (score: number): string => {
  if (score >= 9) return 'S';
  if (score >= 7) return 'A';
  if (score >= 5) return 'B';
  if (score >= 3) return 'C';
  return 'D';
};

/**
 * 计算项目统计
 */
export const calculateProjectStats = (projects: Project[]) => {
  if (projects.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      recommended: 0,
      notRecommended: 0,
      byStage: {} as Record<string, number>,
      byIndustry: {} as Record<string, number>,
      byPipelineStatus: {} as Record<string, number>,
      scoreDistribution: {
        excellent: 0,  // 9-10
        good: 0,       // 7-8.9
        fair: 0,       // 5-6.9
        poor: 0        // <5
      }
    };
  }
  
  const averageScore = parseFloat(
    (projects.reduce((sum, p) => sum + p.totalScore, 0) / projects.length).toFixed(1)
  );
  
  const recommended = projects.filter(p => p.totalScore * 10 >= 70).length;
  const notRecommended = projects.filter(p => p.totalScore * 10 < 70).length;
  
  const byStage: Record<string, number> = {};
  const byIndustry: Record<string, number> = {};
  const byPipelineStatus: Record<string, number> = {};
  
  const scoreDistribution = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0
  };
  
  projects.forEach(p => {
    // 统计阶段
    byStage[p.stage] = (byStage[p.stage] || 0) + 1;
    
    // 统计行业
    byIndustry[p.industry] = (byIndustry[p.industry] || 0) + 1;
    
    // 统计Pipeline状态
    if (p.pipelineStatus) {
      byPipelineStatus[p.pipelineStatus] = (byPipelineStatus[p.pipelineStatus] || 0) + 1;
    }
    
    // 统计评分分布
    if (p.totalScore >= 9) scoreDistribution.excellent++;
    else if (p.totalScore >= 7) scoreDistribution.good++;
    else if (p.totalScore >= 5) scoreDistribution.fair++;
    else scoreDistribution.poor++;
  });
  
  return {
    total: projects.length,
    averageScore,
    recommended,
    notRecommended,
    byStage,
    byIndustry,
    byPipelineStatus,
    scoreDistribution
  };
};

/**
 * 生成评估报告内容
 */
export const generateAssessmentReport = (project: Project): string => {
  const decision = getInvestmentDecision(project.totalScore);
  const percentage = (project.totalScore * 10).toFixed(1);
  
  let report = `
# 投资评估报告

## 项目基本信息
- 项目名称：${project.name}
- 公司名称：${project.company}
- 融资阶段：${project.stage}
- 行业：${project.industry}
- 评估日期：${new Date(project.createdAt).toLocaleDateString()}

## 评估结果
- 综合评分：${project.totalScore}/10
- 百分制评分：${percentage}/100
- 投资决策：${decision.decision}
- 决策理由：${decision.reason}

## 各维度评分
`;
  
  DIMENSIONS.forEach(dim => {
    const score = project.scores[dim.id] || 0;
    report += `\n### ${dim.icon} ${dim.name} (${dim.weight}%)\n`;
    report += `- 评分：${score}/10\n`;
    
    dim.indicators.forEach(ind => {
      const indicatorScore = score || 5;
      report += `  - ${ind.name}: ${indicatorScore}/10\n`;
    });
  });
  
  report += `

## 投资原则
总分低于70分的项目，不予投资。

## 备注
${project.notes || '无'}
`;
  
  return report;
};
