import { type ExcelColumn } from '@/types';

export function formatCellValue(value: any, column: ExcelColumn, row?: any): string | React.ReactNode {
  if (value == null || value === '') return '';

  switch (column.type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(value) || 0);

    case 'percent':
      return `${value}%`;

    case 'boolean':
      return value === true || value === '1' || value === 'true' ? 'Yes' : 'No';

    case 'text':
      // Handle category display
      if (column.key === 'major_group' && row?.major_group_name) {
        return row.major_group_name;
      }
      if (column.key === 'category' && row?.category_name) {
        return row.category_name;
      }
      if (column.key === 'sub_category' && row?.sub_category_name) {
        return row.sub_category_name;
      }
      return String(value);

    default:
      return String(value);
  }
}