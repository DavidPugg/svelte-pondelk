set -e

psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$DB_NAME') THEN
        CREATE DATABASE $DB_NAME;
        GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
    END IF;
END $$;
EOSQL
