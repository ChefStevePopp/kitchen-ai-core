export interface TeamMemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  departments: string[];
  roles: string[];
  locations: string[];
  lastUpdated?: string;
}