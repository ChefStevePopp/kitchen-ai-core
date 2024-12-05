import React from 'react';
import { Activity, Code, GitBranch, AlertTriangle } from 'lucide-react';
import { useKAI } from '@/hooks/useKAI';

export const AppHealthPanel: React.FC = () => {
  const { projectHealth } = useKAI();

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const metrics = [
    {
      name: 'Code Quality',
      value: projectHealth.codeQuality,
      icon: Code,
      description: 'Overall code quality score based on best practices'
    },
    {
      name: 'Test Coverage',
      value: projectHealth.testCoverage,
      icon: Activity,
      description: 'Percentage of code covered by tests'
    },
    {
      name: 'Technical Debt',
      value: 100 - projectHealth.technicalDebt,
      icon: GitBranch,
      description: 'Inverse score of technical debt - higher is better'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const colorClass = getHealthColor(metric.value);
          
          return (
            <div key={metric.name} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-300">{metric.name}</h4>
                  <p className={`text-2xl font-bold ${colorClass}`}>
                    {metric.value}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{metric.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h4 className="text-sm font-medium text-white">Health Analysis</h4>
        </div>
        <div className="space-y-3">
          {projectHealth.codeQuality < 90 && (
            <p className="text-sm text-gray-300">
              • Code quality could be improved through better documentation and consistent patterns
            </p>
          )}
          {projectHealth.testCoverage < 90 && (
            <p className="text-sm text-gray-300">
              • Test coverage should be increased, particularly for critical business logic
            </p>
          )}
          {projectHealth.technicalDebt > 20 && (
            <p className="text-sm text-gray-300">
              • Technical debt should be addressed in upcoming sprints
            </p>
          )}
        </div>
      </div>
    </div>
  );
};