CREATE extension if NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pdf_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    title TEXT,
    file_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at =CURRENT_TIMESTAMP;
 RETURN NEW;
 END;
 $$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
 BEFORE UPDATE ON  users
 FOR EACH ROW
 EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER pdf_summary_user_updated_at
 BEFORE UPDATE ON  pdf_summary
 FOR EACH ROW
 EXECUTE FUNCTION update_updated_at_column();

