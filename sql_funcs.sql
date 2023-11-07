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

CREATE SEQUENCE order_code_seq;
//receipt code
CREATE OR REPLACE FUNCTION generate_order_code(tenant_name VARCHAR)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'ORD-'; -- Change the prefix as needed
    tenant_prefix TEXT;
BEGIN
    -- Extract the first 3 letters from tenant_name (ensure tenant_name is at least 3 characters long)
    tenant_prefix := LEFT(tenant_name, 3);
    
    -- Use tenant_prefix, current date and time, and a sequence value to generate the order code with dashes
    RETURN prefix || tenant_prefix || '-' || to_char(NOW(), 'HH24MI-SS-YYYY-MM-DD') || '-' || (SELECT nextval('order_code_seq'));
END;
$$ LANGUAGE plpgsql;

