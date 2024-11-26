CREATE SCHEMA settlethis;

GRANT USAGE ON SCHEMA settlethis TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA settlethis TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA settlethis TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA settlethis TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA settlethis GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA settlethis GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA settlethis GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Add it as an exposed schema in Supabase: https://supabase.com/dashboard/project/gdyjsqmpybjcsrevmlmq/settings/api