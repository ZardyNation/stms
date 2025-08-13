
CREATE TABLE IF NOT EXISTS nominations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nominee_name TEXT NOT NULL,
    nominee_org TEXT,
    category_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    nominator_name TEXT NOT NULL,
    nominator_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_category
        FOREIGN KEY(category_id) 
        REFERENCES categories(id)
        ON DELETE SET NULL
);
