import React, { useState } from 'react';
import { FileDown, FileUp, Brain, AlertTriangle } from 'lucide-react';
import { generateProjectState } from '@/utils/projectState';
import { parseProjectDocument } from '@/utils/projectParser';
import { AppHealthPanel } from './AppHealthPanel';
import toast from 'react-hot-toast';

export const DevelopmentConsciousness: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const projectState = await generateProjectState();
      
      // Create blob and download
      const blob = new Blob([projectState], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kitchen-ai-project-state-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Project state exported successfully');
    } catch (error) {
      console.error('Error exporting project state:', error);
      toast.error('Failed to export project state');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const analysis = await parseProjectDocument(content);
        
        // Update project state with analysis
        console.log('Project analysis:', analysis);
        toast.success('Project state imported and analyzed');
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error analyzing project state:', error);
      toast.error('Failed to analyze project state');
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Development Consciousness</h3>
          <p className="text-sm text-gray-400">Project state tracking and analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* App Health Panel */}
        <AppHealthPanel />

        {/* Export/Import Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Export Project State</h4>
            <p className="text-sm text-gray-400 mt-1">
              Generate comprehensive documentation of current project state
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isGenerating}
            className="btn-ghost text-primary-400 hover:text-primary-300"
          >
            <FileDown className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Export'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Import Project Analysis</h4>
            <p className="text-sm text-gray-400 mt-1">
              Upload previous project state for analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="btn-ghost text-primary-400 hover:text-primary-300"
            >
              <FileUp className="w-5 h-5 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Import'}
            </button>
          </div>
        </div>

        <div className="bg-yellow-500/10 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium">Project Analysis</p>
              <p className="text-sm text-gray-300 mt-1">
                The development consciousness system maintains a complete understanding of:
              </p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 list-disc list-inside">
                <li>Current implementation state</li>
                <li>Component relationships and dependencies</li>
                <li>Business logic and validation rules</li>
                <li>Development roadmap and priorities</li>
                <li>Technical debt and optimization opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};