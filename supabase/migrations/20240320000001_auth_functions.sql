-- Create function to handle organization initialization
CREATE OR REPLACE FUNCTION initialize_organization(
  user_id UUID,
  org_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Create organization
  INSERT INTO organizations (
    name,
    owner_id,
    settings
  ) VALUES (
    COALESCE(
      org_name,
      (SELECT email FROM auth_users WHERE id = user_id)
    ),
    user_id,
    jsonb_build_object(
      'business_type', 'restaurant',
      'default_timezone', 'America/Toronto',
      'multi_unit', false,
      'currency', 'CAD'
    )
  ) RETURNING id INTO org_id;

  -- Create owner role
  INSERT INTO user_roles (
    user_id,
    organization_id,
    role
  ) VALUES (
    user_id,
    org_id,
    'owner'
  );

  -- Update user metadata
  UPDATE auth_users
  SET metadata = metadata || jsonb_build_object(
    'organizationId', org_id,
    'role', 'owner'
  )
  WHERE id = user_id;

  RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle user session management
CREATE OR REPLACE FUNCTION create_user_session(
  user_id UUID,
  session_duration INTERVAL DEFAULT '24 hours'
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  -- Delete any existing expired sessions
  DELETE FROM auth_sessions 
  WHERE user_id = create_user_session.user_id 
    AND expires_at < now();

  -- Create new session
  INSERT INTO auth_sessions (
    user_id,
    expires_at
  ) VALUES (
    user_id,
    now() + session_duration
  ) RETURNING id INTO session_id;

  -- Update last sign in
  UPDATE auth_users
  SET last_sign_in_at = now()
  WHERE id = user_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate session
CREATE OR REPLACE FUNCTION validate_session(session_id UUID)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    u.id as user_id,
    u.metadata
  FROM auth_sessions s
  JOIN auth_users u ON u.id = s.user_id
  WHERE s.id = session_id
    AND s.expires_at > now()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle role assignments
CREATE OR REPLACE FUNCTION assign_user_role(
  org_id UUID,
  user_id UUID,
  role_name TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Verify role name
  IF role_name NOT IN ('owner', 'admin', 'staff') THEN
    RAISE EXCEPTION 'Invalid role name';
  END IF;

  -- Insert or update role
  INSERT INTO user_roles (
    organization_id,
    user_id,
    role
  ) VALUES (
    org_id,
    user_id,
    role_name
  )
  ON CONFLICT (user_id, organization_id) 
  DO UPDATE SET role = role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;