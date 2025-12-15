-- Remove unique constraints from categories table
-- Run this manually if you get duplicate key errors
-- First, find and drop the unique constraints
ALTER TABLE categories DROP CONSTRAINT IF EXISTS uk_d576rarhe2iffdxdeo5y1mksw;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_tr_key;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_en_key;
-- If the above doesn't work, try these alternative names
DO $$
DECLARE constraint_name text;
BEGIN FOR constraint_name IN
SELECT conname
FROM pg_constraint
WHERE conrelid = 'categories'::regclass
    AND contype = 'u' LOOP EXECUTE 'ALTER TABLE categories DROP CONSTRAINT ' || constraint_name;
END LOOP;
END $$;