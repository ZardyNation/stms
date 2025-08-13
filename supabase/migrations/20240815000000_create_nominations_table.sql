CREATE TABLE nominations (
    id BIGSERIAL PRIMARY KEY,
    nominee_name TEXT NOT NULL,
    nominee_org TEXT,
    category_id UUID REFERENCES categories(id),
    reason TEXT NOT NULL,
    nominator_name TEXT NOT NULL,
    nominator_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
