import { jsPDF } from 'jspdf';
import { supabase } from '@/lib/supabase';

interface ProjectComponent {
  name: string;
  path: string;
  status: 'complete' | 'in-progress' | 'planned';
  dependencies: string[];
  description: string;
}

interface ProjectState {
  version: string;
  timestamp: string;
  components: ProjectComponent[];
  dataSchema: any;
  businessRules: any[];
  roadmap: any[];
}

export async function generateProjectState(): Promise<string> {
  try {
    // Create PDF document
    const doc = new jsPDF();
    const projectState = await collectProjectState();

    // Add title
    doc.setFontSize(20);
    doc.text('Kitchen AI Project State', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

    // Add sections
    let yPos = 40;

    // Components Section
    doc.setFontSize(16);
    doc.text('Components', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    projectState.components.forEach(component => {
      doc.text(`- ${component.name} (${component.status})`, 25, yPos);
      yPos += 5;
      doc.setFontSize(10);
      doc.text(component.description, 30, yPos);
      yPos += 10;
      doc.setFontSize(12);
    });

    // Data Schema Section
    yPos += 10;
    doc.setFontSize(16);
    doc.text('Data Schema', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    Object.entries(projectState.dataSchema).forEach(([table, schema]) => {
      doc.text(`- ${table}`, 25, yPos);
      yPos += 10;
    });

    // Business Rules Section
    yPos += 10;
    doc.setFontSize(16);
    doc.text('Business Rules', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    projectState.businessRules.forEach(rule => {
      doc.text(`- ${rule.name}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(10);
      doc.text(rule.description, 30, yPos);
      yPos += 10;
      doc.setFontSize(12);
    });

    // Roadmap Section
    yPos += 10;
    doc.setFontSize(16);
    doc.text('Development Roadmap', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    projectState.roadmap.forEach(item => {
      doc.text(`- ${item.title}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(10);
      doc.text(item.description, 30, yPos);
      yPos += 10;
      doc.setFontSize(12);
    });

    return doc.output();
  } catch (error) {
    console.error('Error generating project state:', error);
    throw error;
  }
}

async function collectProjectState(): Promise<ProjectState> {
  // Get database schema
  const { data: schemaData } = await supabase
    .from('food_category_groups')
    .select('*')
    .limit(1);

  // Define core components
  const components: ProjectComponent[] = [
    {
      name: 'Food Relationships Manager',
      path: 'src/features/admin/components/sections/FoodRelationshipsManager',
      status: 'complete',
      dependencies: ['food_category_groups', 'food_categories', 'food_sub_categories'],
      description: 'Manages hierarchical food categorization system'
    },
    {
      name: 'Master Ingredients',
      path: 'src/features/admin/components/sections/MasterIngredientList',
      status: 'complete',
      dependencies: ['master_ingredients', 'food_relationships'],
      description: 'Manages master ingredient database with allergen tracking'
    },
    {
      name: 'Inventory Management',
      path: 'src/features/admin/components/sections/InventoryManagement',
      status: 'complete',
      dependencies: ['inventory_counts', 'master_ingredients'],
      description: 'Tracks inventory levels and costs'
    }
  ];

  // Define business rules
  const businessRules = [
    {
      name: 'Food Category Hierarchy',
      description: 'Major Groups > Categories > Sub-Categories with organization scoping'
    },
    {
      name: 'Allergen Tracking',
      description: 'Comprehensive allergen tracking system with custom allergen support'
    },
    {
      name: 'Inventory Control',
      description: 'Real-time inventory tracking with cost calculations'
    }
  ];

  // Define development roadmap
  const roadmap = [
    {
      title: 'Recipe Management',
      description: 'Implementation of recipe creation and cost calculation system'
    },
    {
      title: 'Production Planning',
      description: 'Daily production planning and prep list generation'
    },
    {
      title: 'Cost Analysis',
      description: 'Advanced cost analysis and reporting system'
    }
  ];

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    components,
    dataSchema: schemaData,
    businessRules,
    roadmap
  };
}