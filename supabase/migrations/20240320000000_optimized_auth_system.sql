-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create optimized users table with minimal fields
CREATE TABLE auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sign_in_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  -- Use BTree index for email lookups
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create organizations table with essential fields
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}'::jsonb,
  -- Use partial index for active organizations
  CONSTRAINT org_name_unique UNIQUE (name)
);

-- Create roles table with minimal structure
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Composite primary key for efficient lookups
  PRIMARY KEY (user_id, organization_id)
);

-- Create sessions table for auth tracking
CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  -- Index for session cleanup
  CONSTRAINT sessions_expires_at_idx CHECK (expires_at > created_at)
);

-- Create efficient indexes
CREATE INDEX auth_users_email_idx ON auth_users(email);
CREATE INDEX auth_users_active_idx ON auth_users(id) WHERE is_active = true;
CREATE INDEX organizations_owner_idx ON organizations(owner_id);
CREATE INDEX user_roles_lookup_idx ON user_roles(user_id, organization_id);
CREATE INDEX sessions_user_lookup_idx ON auth_sessions(user_id, expires_at);

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_auth_users_timestamp
  BEFORE UPDATE ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION register_user(
  p_email TEXT,
  p_password TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Insert user
  INSERT INTO auth_users (
    email,
    encrypted_password,
    metadata
  ) VALUES (
    lower(p_email),
    crypt(p_password, gen_salt('bf')),
    p_metadata
  ) RETURNING id INTO v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify password
CREATE OR REPLACE FUNCTION verify_user(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE (
  user_id UUID,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, metadata
  FROM auth_users
  WHERE email = lower(p_email)
    AND encrypted_password = crypt(p_password, encrypted_password)
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create maintenance function
CREATE OR REPLACE FUNCTION perform_auth_maintenance()
RETURNS void AS $$
BEGIN
  -- Clean expired sessions
  PERFORM cleanup_expired_sessions();
  
  -- Vacuum tables to reclaim space
  VACUUM ANALYZE auth_users;
  VACUUM ANALYZE auth_sessions;
  VACUUM ANALYZE user_roles;
  
  -- Update statistics
  ANALYZE auth_users;
  ANALYZE auth_sessions;
  ANALYZE user_roles;
END;
$$ LANGUAGE plpgsql;

-- Create scheduled maintenance
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'auth-maintenance',
  '0 0 * * *', -- Run daily at midnight
  $$SELECT perform_auth_maintenance()$$
);

-- Add RLS policies
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON auth_users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id 
      FROM user_roles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Add helpful comments
COMMENT ON TABLE auth_users IS 'Core user accounts with minimal required fields';
COMMENT ON TABLE organizations IS 'Organizations with essential metadata';
COMMENT ON TABLE user_roles IS 'User role assignments within organizations';
COMMENT ON TABLE auth_sessions IS 'Active authentication sessions';