CREATE TABLE bites (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  path ltree NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, NOW()) NOT NULL,
  data JSONB
);

CREATE INDEX path_idx ON bites USING GIST (path);

ALTER TABLE bites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their bites"
    ON bites
    FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert new bites"
    ON bites
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can update their bites"
    ON bites
    FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can delete their bites"
    ON bites
    FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION delete_by_ltree_prefix(prefix ltree)
RETURNS void AS $$
BEGIN
  DELETE FROM bites WHERE PATH <@ prefix;
END;
$$ LANGUAGE plpgsql;
