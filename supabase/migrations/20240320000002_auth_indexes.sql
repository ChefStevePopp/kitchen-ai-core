-- Create optimized indexes for auth queries
CREATE INDEX IF NOT EXISTS auth_users_email_lookup 
ON auth_users(email) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS auth_users_metadata 
ON auth_users USING gin(metadata);

CREATE INDEX IF NOT EXISTS organizations_search 
ON organizations(name text_pattern_ops);

CREATE INDEX IF NOT EXISTS user_roles_user_lookup 
ON user_roles(user_id, role);

CREATE INDEX IF NOT EXISTS user_roles_org_lookup 
ON user_roles(organization_id, role);

CREATE INDEX IF NOT EXISTS sessions_cleanup 
ON auth_sessions(expires_at) 
WHERE expires_at < now();

-- Add index statistics hints
ALTER TABLE auth_users ALTER COLUMN email SET STATISTICS 1000;
ALTER TABLE organizations ALTER COLUMN name SET STATISTICS 1000;
ALTER TABLE user_roles ALTER COLUMN role SET STATISTICS 1000;

-- Create partial indexes for common queries
CREATE INDEX IF NOT EXISTS active_owners 
ON user_roles(user_id) 
WHERE role = 'owner';

CREATE INDEX IF NOT EXISTS active_admins 
ON user_roles(user_id) 
WHERE role = 'admin';

-- Create composite indexes for joins
CREATE INDEX IF NOT EXISTS user_org_role_lookup 
ON user_roles(user_id, organization_id, role);

-- Add helpful comments
COMMENT ON INDEX auth_users_email_lookup IS 'Optimized index for email lookups of active users';
COMMENT ON INDEX auth_users_metadata IS 'GIN index for JSONB metadata queries';
COMMENT ON INDEX organizations_search IS 'Index for organization name pattern matching';
COMMENT ON INDEX sessions_cleanup IS 'Partial index to help with session cleanup';