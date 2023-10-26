//consignment code

CREATE OR REPLACE FUNCTION generate_ref_code(tenant_name1 VARCHAR, tenant_name2 VARCHAR)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'TRF-'; -- Change the prefix as needed
    outlet_code1 TEXT;
    outlet_code2 TEXT;
BEGIN
    -- Extract the first 3 letters from tenant_name1 and tenant_name2
    outlet_code1 := LEFT(tenant_name1, 3);
    outlet_code2 := LEFT(tenant_name2, 3);

    -- Use outlet_code1, outlet_code2, current date, and time to generate the reference code
    RETURN prefix || outlet_code1 || '-'|| outlet_code2 || '-' || to_char(NOW(), 'HH24MISS-YYYY-MM-DD');
END;
$$ LANGUAGE plpgsql;

-- Example usage of the generate_ref_code function
SELECT generate_ref_code('KEJ', 'PAT');
