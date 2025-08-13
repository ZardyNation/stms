
CREATE TABLE IF NOT EXISTS public.nominations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    nominee_name text NOT NULL,
    nominee_org text,
    category_id uuid NOT NULL,
    reason text NOT NULL,
    nominator_name text NOT NULL,
    nominator_email text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    CONSTRAINT nominations_pkey PRIMARY KEY (id),
    CONSTRAINT nominations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
