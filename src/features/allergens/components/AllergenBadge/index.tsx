import React from 'react';
import {
  Wheat,
  Fish,
  Egg,
  Milk,
  Nut,
  Leaf,
  AlertTriangle,
  Shell,
  Citrus,
  Flame,
  type LucideIcon
} from 'lucide-react';

export type AllergenType = 
  | 'peanut' | 'crustacean' | 'treenut' | 'shellfish' | 'sesame'
  | 'soy' | 'fish' | 'wheat' | 'milk' | 'sulphite' | 'egg'
  | 'gluten' | 'mustard' | 'celery' | 'garlic' | 'onion'
  | 'nitrite' | 'mushroom' | 'hot_pepper' | 'citrus' | 'pork';

interface AllergenBadgeProps {
  type: AllergenType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ALLERGEN_CONFIG: Record<AllergenType, {
  icon: LucideIcon;
  label: string;
  color: string;
}> = {
  wheat: { icon: Wheat, label: 'Wheat', color: 'amber' },
  fish: { icon: Fish, label: 'Fish', color: 'blue' },
  egg: { icon: Egg, label: 'Egg', color: 'yellow' },
  milk: { icon: Milk, label: 'Dairy', color: 'white' },
  peanut: { icon: Nut, label: 'Peanut', color: 'orange' },
  treenut: { icon: Nut, label: 'Tree Nut', color: 'brown' },
  soy: { icon: Leaf, label: 'Soy', color: 'green' },
  shellfish: { icon: Shell, label: 'Shellfish', color: 'red' },
  crustacean: { icon: Shell, label: 'Crustacean', color: 'pink' },
  sesame: { icon: AlertTriangle, label: 'Sesame', color: 'gray' },
  sulphite: { icon: AlertTriangle, label: 'Sulphite', color: 'purple' },
  mustard: { icon: AlertTriangle, label: 'Mustard', color: 'yellow' },
  celery: { icon: Leaf, label: 'Celery', color: 'green' },
  garlic: { icon: AlertTriangle, label: 'Garlic', color: 'purple' },
  onion: { icon: AlertTriangle, label: 'Onion', color: 'red' },
  nitrite: { icon: AlertTriangle, label: 'Nitrite', color: 'pink' },
  mushroom: { icon: AlertTriangle, label: 'Mushroom', color: 'gray' },
  hot_pepper: { icon: Flame, label: 'Hot Pepper', color: 'red' },
  citrus: { icon: Citrus, label: 'Citrus', color: 'orange' },
  gluten: { icon: Wheat, label: 'Gluten', color: 'amber' },
  pork: { icon: AlertTriangle, label: 'Pork', color: 'rose' }
};

export const AllergenBadge: React.FC<AllergenBadgeProps> = ({ 
  type, 
  size = 'md',
  showLabel = false 
}) => {
  const config = ALLERGEN_CONFIG[type];
  if (!config) {
    console.warn(`Unknown allergen type: ${type}`);
    return null;
  }

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className="group relative inline-flex items-center">
      <div className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        bg-${config.color}-500/20
        text-${config.color}-400
        transition-transform
        hover:scale-110
        cursor-help
      `}>
        <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      </div>
      
      {/* Tooltip */}
      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        px-2 py-1 rounded bg-gray-800 text-white text-xs
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity
        pointer-events-none
        z-10
      ">
        {config.label}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full
                      border-4 border-transparent border-t-gray-800" />
      </div>

      {showLabel && (
        <span className="ml-2 text-sm text-gray-300">
          {config.label}
        </span>
      )}
    </div>
  );
};