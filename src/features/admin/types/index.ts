export interface Stats {
  activeStaff: number;
  lowStockItems: number;
  pendingTasks: number;
  prepCompletion: number;
}

export interface Activity {
  id: string;
  type: 'recipe' | 'inventory' | 'team' | 'system';
  message: string;
  user: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  details: string;
  timestamp: string;
}

export interface AdminStore {
  stats: Stats;
  activities: Activity[];
  alerts: Alert[];
  calendarFeedUrl: string | null;
  defaultRecipeImage: string;
  setStats: (stats: Stats) => void;
  addActivity: (activity: Activity) => void;
  addAlert: (alert: Alert) => void;
  setCalendarFeedUrl: (url: string) => void;
  setDefaultRecipeImage: (url: string) => void;
}