-- Show table structure
SELECT 
  a.attname as column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
  a.attnotnull as is_required,
  pg_get_expr(d.adbin, d.adrelid) as default_value,
  col_description(a.attrelid, a.attnum) as description
FROM pg_catalog.pg_attribute a
LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
WHERE a.attrelid = 'master_ingredients'::regclass
  AND a.attnum > 0 
  AND NOT a.attisdropped
ORDER BY a.attnum;

-- Show constraints
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'master_ingredients'::regclass;

-- Show indexes
SELECT
  i.relname as index_name,
  pg_get_indexdef(i.oid) as index_definition
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
WHERE t.relname = 'master_ingredients';