interface ProjectAnalysis {
  version: string;
  timestamp: string;
  components: {
    name: string;
    status: string;
    completionPercentage: number;
  }[];
  missingFeatures: string[];
  recommendations: string[];
}

export async function parseProjectDocument(content: string): Promise<ProjectAnalysis> {
  try {
    // Parse PDF content
    const analysis: ProjectAnalysis = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      components: [],
      missingFeatures: [],
      recommendations: []
    };

    // Extract component information
    const componentMatches = content.match(/Components:([\s\S]*?)Data Schema:/);
    if (componentMatches) {
      const componentSection = componentMatches[1];
      const componentLines = componentSection.split('\n').filter(Boolean);
      
      componentLines.forEach(line => {
        const match = line.match(/- (.*?) \((.*?)\)/);
        if (match) {
          analysis.components.push({
            name: match[1],
            status: match[2],
            completionPercentage: match[2] === 'complete' ? 100 : 50
          });
        }
      });
    }

    // Identify missing features
    const expectedFeatures = [
      'Recipe Management',
      'Production Planning',
      'Cost Analysis',
      'Team Management',
      'Reporting'
    ];

    const implementedFeatures = analysis.components.map(c => c.name);
    analysis.missingFeatures = expectedFeatures.filter(
      feature => !implementedFeatures.includes(feature)
    );

    // Generate recommendations
    analysis.recommendations = [
      'Implement recipe management system',
      'Add production planning features',
      'Enhance cost analysis capabilities',
      'Develop comprehensive reporting',
      'Add team management features'
    ];

    return analysis;
  } catch (error) {
    console.error('Error parsing project document:', error);
    throw error;
  }
}