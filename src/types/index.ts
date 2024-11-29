export interface ExcelData {
  id: string;
  itemId: string;
  productName: string;
  category: string;
  subCategory: string;
  vendor: string;
  itemCode: string;
  unitOfMeasure: string;
  caseSize: string;
  unitsPerCase: string;
  price: number;
  adjustedPrice: number;
  yieldPercent: number;
  lastUpdated: string;
  image?: string;
}

export * from './recipe';
export * from './supabase';