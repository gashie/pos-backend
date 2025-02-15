PGDMP         4            
    {            shopdb    14.7 (Homebrew)    14.7 (Homebrew) �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    49373    shopdb    DATABASE     Q   CREATE DATABASE shopdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE shopdb;
                admin    false                       1255    50712    auto_create_api_key()    FUNCTION     �   CREATE FUNCTION public.auto_create_api_key() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.api_key := generate_and_return_api_key(NEW.outlet_id);
    RETURN NEW;
END;
$$;
 ,   DROP FUNCTION public.auto_create_api_key();
       public          bwilliam    false                       1255    49668 &   generate_order_code(character varying)    FUNCTION     e  CREATE FUNCTION public.generate_order_code(tenant_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix TEXT := 'ORD-'; -- Change the prefix as needed
    tenant_prefix TEXT;
BEGIN
    -- Extract the first 3 letters from tenant_name (ensure tenant_name is at least 3 characters long)
    tenant_prefix := LEFT(tenant_name, 3);
    
    -- Use tenant_prefix, current date and time, and a sequence value to generate the order code with dashes
    RETURN prefix || tenant_prefix || '-' || to_char(NOW(), 'HH24MI-SS-YYYY-MM-DD') || '-' || (SELECT nextval('order_code_seq'));
END;
$$;
 I   DROP FUNCTION public.generate_order_code(tenant_name character varying);
       public          bwilliam    false                       1255    49667 7   generate_ref_code(character varying, character varying)    FUNCTION     w  CREATE FUNCTION public.generate_ref_code(tenant_name1 character varying, tenant_name2 character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
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
$$;
 h   DROP FUNCTION public.generate_ref_code(tenant_name1 character varying, tenant_name2 character varying);
       public          bwilliam    false            �            1259    49374    account    TABLE       CREATE TABLE public.account (
    account_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    username character varying(255),
    email character varying(300),
    phone character varying(20),
    first_name character varying(300),
    last_name character varying(300),
    is_verified boolean,
    is_active boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    role character varying(20),
    password text,
    deleted_at timestamp with time zone
);
    DROP TABLE public.account;
       public         heap    bwilliam    false            �            1259    52565    bank_accounts    TABLE     �  CREATE TABLE public.bank_accounts (
    bank_account_id uuid DEFAULT gen_random_uuid() NOT NULL,
    bank_id uuid NOT NULL,
    account_number numeric,
    account_name character varying(350),
    branch_name character varying(250),
    branch_sort_code numeric,
    account_id uuid,
    tenant_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false
);
 !   DROP TABLE public.bank_accounts;
       public         heap    bwilliam    false            �            1259    52552    banks    TABLE     �  CREATE TABLE public.banks (
    bank_id uuid DEFAULT gen_random_uuid() NOT NULL,
    bank_name character varying(250) NOT NULL,
    slug character varying(200),
    code character varying(100),
    long_code character varying(150),
    gateway text,
    active boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    country character varying(300),
    bank_type character varying(200),
    created_at time without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);
    DROP TABLE public.banks;
       public         heap    bwilliam    false            �            1259    49385    brands    TABLE     n  CREATE TABLE public.brands (
    brand_id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_name character varying(255) NOT NULL,
    description text,
    origin_country character varying(100),
    website_url character varying(255),
    tenant_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);
    DROP TABLE public.brands;
       public         heap    bwilliam    false            �            1259    49394 
   categories    TABLE     N  CREATE TABLE public.categories (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(255) NOT NULL,
    description text,
    cat_image character varying(300),
    tenant_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);
    DROP TABLE public.categories;
       public         heap    bwilliam    false            �            1259    49403    consignment    TABLE     @  CREATE TABLE public.consignment (
    consignment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transfer_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    tenant_id uuid,
    outlet_id uuid,
    picked_up_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    picked_up_by uuid
);
    DROP TABLE public.consignment;
       public         heap    bwilliam    false            �            1259    51829    coupon    TABLE     �   CREATE TABLE public.coupon (
    coupon_id uuid DEFAULT gen_random_uuid() NOT NULL,
    promotion_id uuid,
    coupon_code character varying(20) NOT NULL,
    is_used boolean DEFAULT false NOT NULL
);
    DROP TABLE public.coupon;
       public         heap    bwilliam    false            �            1259    49410    credit_history    TABLE       CREATE TABLE public.credit_history (
    credit_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    order_id uuid,
    total_amount_paid numeric(13,2),
    total_amount_due numeric(13,2),
    total_amount_remaining numeric(13,2),
    transaction_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expected_payment_date date,
    tenant_id uuid,
    outlet_id uuid,
    recorded_by uuid,
    remarks text,
    last_payment_date timestamp without time zone,
    complete_credit boolean DEFAULT false
);
 "   DROP TABLE public.credit_history;
       public         heap    bwilliam    false            �            1259    49719    credit_payments    TABLE     t  CREATE TABLE public.credit_payments (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    outlet_id uuid NOT NULL,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    amount numeric(13,2) NOT NULL,
    notes text,
    is_completed boolean DEFAULT false NOT NULL,
    payment_method character varying(50),
    order_reference character varying(50),
    receipt_image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    order_id uuid,
    next_payment_date date,
    balance numeric(13,2)
);
 #   DROP TABLE public.credit_payments;
       public         heap    bwilliam    false            �            1259    51841    customer_promotion_usage    TABLE     �   CREATE TABLE public.customer_promotion_usage (
    customer_id uuid,
    promotion_id uuid,
    coupon_id uuid,
    usage_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 ,   DROP TABLE public.customer_promotion_usage;
       public         heap    bwilliam    false            �            1259    49419 	   customers    TABLE     )  CREATE TABLE public.customers (
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    address_line1 character varying(300),
    city character varying(100),
    state_province character varying(100),
    postal_code character varying(20),
    country character varying(100),
    preferred_contact_method character varying(60),
    additional_info text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    tenant_id uuid,
    username character varying(200),
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT false,
    password character varying(300)
);
    DROP TABLE public.customers;
       public         heap    bwilliam    false            �            1259    49790    ecommerce_addresses    TABLE     �  CREATE TABLE public.ecommerce_addresses (
    address_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    street_address character varying(300) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100),
    postal_code character varying(15) NOT NULL,
    country character varying(100) NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
 '   DROP TABLE public.ecommerce_addresses;
       public         heap    bwilliam    false            �            1259    49769    expense_category    TABLE     F  CREATE TABLE public.expense_category (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    created_by uuid,
    tenant_id uuid
);
 $   DROP TABLE public.expense_category;
       public         heap    bwilliam    false            �            1259    49752    expenses    TABLE     l  CREATE TABLE public.expenses (
    expense_id uuid DEFAULT gen_random_uuid() NOT NULL,
    description text,
    amount numeric(13,2) NOT NULL,
    transaction_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    created_by uuid,
    tenant_id uuid,
    expense_category uuid
);
    DROP TABLE public.expenses;
       public         heap    bwilliam    false            �            1259    51729    feedback    TABLE     S  CREATE TABLE public.feedback (
    feedback_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    order_id uuid,
    feedback_text text NOT NULL,
    rating integer,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
    DROP TABLE public.feedback;
       public         heap    bwilliam    false            �            1259    49432    fees    TABLE       CREATE TABLE public.fees (
    charged_percentage numeric(13,0),
    charged_amount numeric(13,2),
    charged_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    paid_status boolean DEFAULT false,
    oauth character varying(300) DEFAULT true
);
    DROP TABLE public.fees;
       public         heap    bwilliam    false            �            1259    49438    fees_charged    TABLE     D  CREATE TABLE public.fees_charged (
    fees_charged_id uuid DEFAULT gen_random_uuid() NOT NULL,
    charged_percentage numeric(13,0),
    charged_amount numeric(13,2),
    order_id uuid,
    order_paid_status character varying(100),
    tenant_id uuid,
    charged_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.fees_charged;
       public         heap    bwilliam    false            �            1259    52604 
   group_band    TABLE     d  CREATE TABLE public.group_band (
    group_band_id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_band_name character varying(250) NOT NULL,
    band_basic_salary numeric(13,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false,
    tenant_id uuid
);
    DROP TABLE public.group_band;
       public         heap    bwilliam    false                        1259    52633    group_band_allowance    TABLE     �  CREATE TABLE public.group_band_allowance (
    band_allowance_id uuid DEFAULT gen_random_uuid(),
    band_allowance_name character varying(250),
    salary_allowance_id uuid,
    group_band_id uuid,
    source_bank_account_id uuid,
    employee_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false
);
 (   DROP TABLE public.group_band_allowance;
       public         heap    bwilliam    false            �            1259    52623    group_band_deduction    TABLE     �  CREATE TABLE public.group_band_deduction (
    band_deduction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    band_deduction_name character varying(250) NOT NULL,
    salary_deduction_id uuid,
    group_band_id uuid,
    source_type character varying(100),
    deduction_bank_account_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false,
    tenant_id uuid,
    source_bank_account_id uuid
);
 (   DROP TABLE public.group_band_deduction;
       public         heap    bwilliam    false            �            1259    49744    income    TABLE     e  CREATE TABLE public.income (
    income_id uuid DEFAULT gen_random_uuid() NOT NULL,
    description text,
    amount numeric(13,2) NOT NULL,
    transaction_date date NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    created_by uuid,
    tenant_id uuid,
    income_category uuid
);
    DROP TABLE public.income;
       public         heap    bwilliam    false            �            1259    49760    income_category    TABLE     E  CREATE TABLE public.income_category (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    created_by uuid,
    tenant_id uuid
);
 #   DROP TABLE public.income_category;
       public         heap    bwilliam    false            �            1259    49445 	   inventory    TABLE     �  CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    qty numeric NOT NULL,
    tenant_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    old_qty numeric,
    added_by uuid,
    min_stock_threshold numeric,
    max_stock_threshold numeric
);
    DROP TABLE public.inventory;
       public         heap    bwilliam    false            �            1259    49454 	   item_unit    TABLE     �   CREATE TABLE public.item_unit (
    unit_id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_type character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);
    DROP TABLE public.item_unit;
       public         heap    bwilliam    false            �            1259    49669    order_code_seq    SEQUENCE     w   CREATE SEQUENCE public.order_code_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.order_code_seq;
       public          bwilliam    false            �            1259    49461    order_items    TABLE     �  CREATE TABLE public.order_items (
    order_item_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(13,2) NOT NULL,
    total_price numeric(13,2) NOT NULL,
    outlet_id uuid,
    tenant_id uuid,
    processed_by uuid,
    customer_id uuid,
    order_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.order_items;
       public         heap    bwilliam    false            �            1259    51883    order_shipments    TABLE     �  CREATE TABLE public.order_shipments (
    shipment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    customer_address_id uuid,
    carrier_id uuid,
    shipment_date date,
    estimated_delivery_date date,
    actual_delivery_date date,
    shipment_status character varying(255),
    tracking_number character varying(255),
    outlet_update character varying(255),
    customer_update character varying(255)
);
 #   DROP TABLE public.order_shipments;
       public         heap    bwilliam    false            �            1259    49468    orders    TABLE     �  CREATE TABLE public.orders (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    customer_id uuid NOT NULL,
    total_amount numeric(13,2) NOT NULL,
    status character varying(50) NOT NULL,
    payment_method character varying(50),
    outlet_id uuid,
    processed_by uuid,
    notes text,
    order_reference character varying(100),
    charge_percentage numeric(13,0),
    charge_amount numeric(13,2),
    discount_fee numeric(13,0),
    cash_received numeric(13,2),
    cash_balance numeric(13,2),
    to_be_delivered boolean,
    delivery_address text,
    amount_to_pay numeric(13,2),
    paid_status character varying(60),
    is_credit boolean DEFAULT false,
    total_amount_due numeric(13,2),
    total_amount_remaining numeric(13,2),
    expected_payment_date date,
    transaction_from character varying(60)
);
    DROP TABLE public.orders;
       public         heap    bwilliam    false            �            1259    49478    outlet    TABLE     2  CREATE TABLE public.outlet (
    outlet_id uuid DEFAULT gen_random_uuid() NOT NULL,
    outlet_name character varying(255) NOT NULL,
    tenant_id uuid NOT NULL,
    is_main_outlet boolean DEFAULT false,
    outlet_description text,
    outlet_address_line1 character varying(255),
    outlet_address_line2 character varying(255),
    outlet_city character varying(100),
    outlet_state_province character varying(100),
    outlet_postal_code character varying(20),
    outlet_country character varying(100),
    outlet_phone character varying(20),
    outlet_email character varying(255),
    opening_hours character varying(255),
    website_url character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    is_electronic boolean DEFAULT false,
    updated_at timestamp without time zone
);
    DROP TABLE public.outlet;
       public         heap    bwilliam    false            �            1259    50697    outlet_api_keys    TABLE     �   CREATE TABLE public.outlet_api_keys (
    api_key_id uuid DEFAULT gen_random_uuid() NOT NULL,
    outlet_id uuid NOT NULL,
    api_key text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id uuid
);
 #   DROP TABLE public.outlet_api_keys;
       public         heap    bwilliam    false            �            1259    49488    outlet_inventory    TABLE     	  CREATE TABLE public.outlet_inventory (
    outlet_inventory_id uuid DEFAULT gen_random_uuid() NOT NULL,
    outlet_id uuid NOT NULL,
    product_id uuid NOT NULL,
    stock_quantity integer NOT NULL,
    min_stock_threshold integer DEFAULT 10 NOT NULL,
    max_stock_threshold integer DEFAULT 20 NOT NULL,
    last_restock_date date,
    last_stock_transfer_date date,
    tenant_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_by uuid NOT NULL,
    transfer_id uuid
);
 $   DROP TABLE public.outlet_inventory;
       public         heap    bwilliam    false            �            1259    49497    product    TABLE     �  CREATE TABLE public.product (
    product_id uuid DEFAULT gen_random_uuid() NOT NULL,
    prod_name character varying(200) NOT NULL,
    prod_desc character varying(500),
    prod_price numeric(13,2),
    cos_price numeric(13,2),
    prod_pic character varying(500),
    cat_id uuid,
    prod_qty numeric DEFAULT 0,
    reorder numeric DEFAULT 10,
    supplier_id uuid NOT NULL,
    tenant_id uuid,
    serial character varying(200),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    brand_id uuid,
    unit_id uuid,
    pack_name character varying(300),
    retail_price numeric(13,0),
    wholesale_price numeric(13,0),
    expiry_date date
);
    DROP TABLE public.product;
       public         heap    bwilliam    false            �            1259    49508    product_variants    TABLE     �  CREATE TABLE public.product_variants (
    variant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    variant_name character varying(100) NOT NULL,
    price_adjustment numeric(10,2) NOT NULL,
    stock_quantity integer NOT NULL,
    weight numeric(10,2),
    dimensions character varying(50),
    color character varying(50),
    size character varying(20),
    is_available boolean NOT NULL,
    date_added date,
    date_modified timestamp without time zone
);
 $   DROP TABLE public.product_variants;
       public         heap    bwilliam    false            �            1259    49514    products    TABLE       CREATE TABLE public.products (
    product_id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock_quantity integer NOT NULL,
    is_available boolean NOT NULL,
    manufacturer character varying(100),
    category character varying(100),
    weight numeric(10,2),
    dimensions character varying(50),
    date_added date,
    date_modified timestamp without time zone,
    image_url character varying(255)
);
    DROP TABLE public.products;
       public         heap    bwilliam    false            �            1259    51800 	   promotion    TABLE     )  CREATE TABLE public.promotion (
    promotion_id uuid DEFAULT gen_random_uuid() NOT NULL,
    promotion_name character varying(255) NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    discount_percent numeric(5,2) NOT NULL,
    tenant_id uuid NOT NULL
);
    DROP TABLE public.promotion;
       public         heap    bwilliam    false            �            1259    52612    salary_allowance    TABLE     W  CREATE TABLE public.salary_allowance (
    salary_allowance_id uuid DEFAULT gen_random_uuid() NOT NULL,
    salary_allowance_name character varying(250) NOT NULL,
    is_taxable boolean DEFAULT false,
    is_flat_rate boolean DEFAULT false,
    flat_rate numeric(13,2),
    is_percentage_rate boolean DEFAULT false,
    percentage_rate numeric(13,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false,
    tenant_id uuid,
    taxable_flat_rate numeric(13,2),
    taxable_percentage_rate numeric
);
 $   DROP TABLE public.salary_allowance;
       public         heap    bwilliam    false            �            1259    52590    salary_deduction    TABLE     �  CREATE TABLE public.salary_deduction (
    salary_deduction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    salary_deduction_name character varying(100) NOT NULL,
    is_flat_rate boolean DEFAULT false,
    flat_rate numeric(13,2),
    is_percentage_rate boolean DEFAULT false,
    percentage_rate numeric,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_deleted boolean DEFAULT false,
    tenant_id uuid
);
 $   DROP TABLE public.salary_deduction;
       public         heap    bwilliam    false            �            1259    51754    shipping_carrier    TABLE     �   CREATE TABLE public.shipping_carrier (
    carrier_id uuid DEFAULT gen_random_uuid() NOT NULL,
    carrier_name character varying(255) NOT NULL,
    description text
);
 $   DROP TABLE public.shipping_carrier;
       public         heap    bwilliam    false            �            1259    51764    shipping_rate    TABLE       CREATE TABLE public.shipping_rate (
    rate_id uuid DEFAULT gen_random_uuid() NOT NULL,
    carrier_id uuid,
    zone_name character varying(255) NOT NULL,
    min_weight numeric(10,2) NOT NULL,
    max_weight numeric(10,2),
    rate numeric(10,2) NOT NULL
);
 !   DROP TABLE public.shipping_rate;
       public         heap    bwilliam    false            �            1259    49522    shop_inventory    TABLE     /  CREATE TABLE public.shop_inventory (
    inventory_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    product_id uuid NOT NULL,
    stock_quantity integer NOT NULL,
    min_stock_threshold integer NOT NULL,
    max_stock_threshold integer NOT NULL,
    last_restock_date date
);
 "   DROP TABLE public.shop_inventory;
       public         heap    bwilliam    false            �            1259    49528    shop_user_access    TABLE     �   CREATE TABLE public.shop_user_access (
    access_id uuid DEFAULT gen_random_uuid() NOT NULL,
    outlet_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(20) NOT NULL,
    is_default boolean DEFAULT true,
    tenant_id uuid
);
 $   DROP TABLE public.shop_user_access;
       public         heap    bwilliam    false            �            1259    51695    shopping_cart    TABLE     �   CREATE TABLE public.shopping_cart (
    cart_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    product_id uuid,
    quantity integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.shopping_cart;
       public         heap    bwilliam    false            �            1259    49535 	   suppliers    TABLE     �  CREATE TABLE public.suppliers (
    supplier_id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_name character varying(350) NOT NULL,
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(20),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state_province character varying(100),
    postal_code character varying(20),
    country character varying(100),
    website_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id uuid,
    updated_at timestamp with time zone
);
    DROP TABLE public.suppliers;
       public         heap    bwilliam    false            �            1259    49544    tenants    TABLE       CREATE TABLE public.tenants (
    tenant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_name character varying(255) NOT NULL,
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(20),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state_province character varying(100),
    postal_code character varying(20),
    country character varying(100),
    website_url character varying(255),
    registration_date date,
    subscription_type character varying(50),
    subscription_expiry_date date,
    is_active boolean DEFAULT true NOT NULL,
    url text,
    has_electronic boolean DEFAULT false,
    show_electronic_popup boolean DEFAULT true
);
    DROP TABLE public.tenants;
       public         heap    bwilliam    false            �            1259    49553    transfer_acknowledgment    TABLE     C  CREATE TABLE public.transfer_acknowledgment (
    acknowledgment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transfer_id uuid NOT NULL,
    received_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_confirmed boolean DEFAULT false NOT NULL,
    remarks text,
    status character varying(100)
);
 +   DROP TABLE public.transfer_acknowledgment;
       public         heap    bwilliam    false            �            1259    49563    transfer_stock    TABLE     
  CREATE TABLE public.transfer_stock (
    transfer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_outlet_id uuid NOT NULL,
    destination_outlet_id uuid NOT NULL,
    transfer_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    is_acknowledged boolean DEFAULT false NOT NULL,
    ref_code character varying(100),
    reference character varying(100),
    processed_by uuid,
    tenant_id uuid,
    transfer_from character varying(100),
    accept_status character varying(600)
);
 "   DROP TABLE public.transfer_stock;
       public         heap    bwilliam    false            �            1259    49573    units    TABLE     �   CREATE TABLE public.units (
    unit_id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_name character varying(50) NOT NULL,
    abbreviation character varying(20),
    description text
);
    DROP TABLE public.units;
       public         heap    bwilliam    false            �            1259    51712    wishlist    TABLE     �   CREATE TABLE public.wishlist (
    wishlist_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    product_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.wishlist;
       public         heap    bwilliam    false            �          0    49374    account 
   TABLE DATA           �   COPY public.account (account_id, tenant_id, username, email, phone, first_name, last_name, is_verified, is_active, created_at, updated_at, role, password, deleted_at) FROM stdin;
    public          bwilliam    false    209   5=      �          0    52565    bank_accounts 
   TABLE DATA           �   COPY public.bank_accounts (bank_account_id, bank_id, account_number, account_name, branch_name, branch_sort_code, account_id, tenant_id, created_at, updated_at, is_deleted) FROM stdin;
    public          bwilliam    false    251   �>      �          0    52552    banks 
   TABLE DATA           �   COPY public.banks (bank_id, bank_name, slug, code, long_code, gateway, active, is_deleted, country, bank_type, created_at, updated_at) FROM stdin;
    public          bwilliam    false    250   �>      �          0    49385    brands 
   TABLE DATA           �   COPY public.brands (brand_id, brand_name, description, origin_country, website_url, tenant_id, created_at, updated_at) FROM stdin;
    public          bwilliam    false    210   �>      �          0    49394 
   categories 
   TABLE DATA           {   COPY public.categories (category_id, category_name, description, cat_image, tenant_id, created_at, updated_at) FROM stdin;
    public          bwilliam    false    211   o?      �          0    49403    consignment 
   TABLE DATA           �   COPY public.consignment (consignment_id, transfer_id, product_id, quantity, tenant_id, outlet_id, picked_up_at, picked_up_by) FROM stdin;
    public          bwilliam    false    212   �?      �          0    51829    coupon 
   TABLE DATA           O   COPY public.coupon (coupon_id, promotion_id, coupon_code, is_used) FROM stdin;
    public          bwilliam    false    247   �@      �          0    49410    credit_history 
   TABLE DATA              COPY public.credit_history (credit_id, customer_id, order_id, total_amount_paid, total_amount_due, total_amount_remaining, transaction_date, expected_payment_date, tenant_id, outlet_id, recorded_by, remarks, last_payment_date, complete_credit) FROM stdin;
    public          bwilliam    false    213   A      �          0    49719    credit_payments 
   TABLE DATA           �   COPY public.credit_payments (payment_id, customer_id, outlet_id, payment_date, amount, notes, is_completed, payment_method, order_reference, receipt_image_url, created_at, updated_at, order_id, next_payment_date, balance) FROM stdin;
    public          bwilliam    false    234   HB      �          0    51841    customer_promotion_usage 
   TABLE DATA           d   COPY public.customer_promotion_usage (customer_id, promotion_id, coupon_id, usage_date) FROM stdin;
    public          bwilliam    false    248   uD      �          0    49419 	   customers 
   TABLE DATA             COPY public.customers (customer_id, first_name, last_name, email, phone_number, address_line1, city, state_province, postal_code, country, preferred_contact_method, additional_info, created_at, updated_at, tenant_id, username, is_verified, is_active, password) FROM stdin;
    public          bwilliam    false    214   �D      �          0    49790    ecommerce_addresses 
   TABLE DATA           �   COPY public.ecommerce_addresses (address_id, customer_id, street_address, city, state, postal_code, country, is_default, created_at, updated_at) FROM stdin;
    public          bwilliam    false    239   F      �          0    49769    expense_category 
   TABLE DATA           �   COPY public.expense_category (category_id, category_name, description, created_at, updated_at, created_by, tenant_id) FROM stdin;
    public          bwilliam    false    238   �F      �          0    49752    expenses 
   TABLE DATA           �   COPY public.expenses (expense_id, description, amount, transaction_date, created_at, updated_at, created_by, tenant_id, expense_category) FROM stdin;
    public          bwilliam    false    236   ;G      �          0    51729    feedback 
   TABLE DATA           n   COPY public.feedback (feedback_id, customer_id, order_id, feedback_text, rating, submission_date) FROM stdin;
    public          bwilliam    false    243   'H      �          0    49432    fees 
   TABLE DATA           d   COPY public.fees (charged_percentage, charged_amount, charged_date, paid_status, oauth) FROM stdin;
    public          bwilliam    false    215   DH      �          0    49438    fees_charged 
   TABLE DATA           �   COPY public.fees_charged (fees_charged_id, charged_percentage, charged_amount, order_id, order_paid_status, tenant_id, charged_date) FROM stdin;
    public          bwilliam    false    216   aH      �          0    52604 
   group_band 
   TABLE DATA           �   COPY public.group_band (group_band_id, group_band_name, band_basic_salary, created_at, updated_at, is_deleted, tenant_id) FROM stdin;
    public          bwilliam    false    253   �I      �          0    52633    group_band_allowance 
   TABLE DATA           �   COPY public.group_band_allowance (band_allowance_id, band_allowance_name, salary_allowance_id, group_band_id, source_bank_account_id, employee_id, created_at, updated_at, is_deleted) FROM stdin;
    public          bwilliam    false    256   �I      �          0    52623    group_band_deduction 
   TABLE DATA           �   COPY public.group_band_deduction (band_deduction_id, band_deduction_name, salary_deduction_id, group_band_id, source_type, deduction_bank_account_id, created_at, updated_at, is_deleted, tenant_id, source_bank_account_id) FROM stdin;
    public          bwilliam    false    255   
J      �          0    49744    income 
   TABLE DATA           �   COPY public.income (income_id, description, amount, transaction_date, created_at, updated_at, created_by, tenant_id, income_category) FROM stdin;
    public          bwilliam    false    235   'J      �          0    49760    income_category 
   TABLE DATA           �   COPY public.income_category (category_id, category_name, description, created_at, updated_at, created_by, tenant_id) FROM stdin;
    public          bwilliam    false    237   �K      �          0    49445 	   inventory 
   TABLE DATA           �   COPY public.inventory (id, product_id, qty, tenant_id, created_at, updated_at, deleted_at, old_qty, added_by, min_stock_threshold, max_stock_threshold) FROM stdin;
    public          bwilliam    false    217    L      �          0    49454 	   item_unit 
   TABLE DATA           O   COPY public.item_unit (unit_id, unit_type, created_at, updated_at) FROM stdin;
    public          bwilliam    false    218   �L      �          0    49461    order_items 
   TABLE DATA           �   COPY public.order_items (order_item_id, order_id, product_id, quantity, unit_price, total_price, outlet_id, tenant_id, processed_by, customer_id, order_date) FROM stdin;
    public          bwilliam    false    219    M      �          0    51883    order_shipments 
   TABLE DATA           �   COPY public.order_shipments (shipment_id, order_id, customer_address_id, carrier_id, shipment_date, estimated_delivery_date, actual_delivery_date, shipment_status, tracking_number, outlet_update, customer_update) FROM stdin;
    public          bwilliam    false    249   kN      �          0    49468    orders 
   TABLE DATA           �  COPY public.orders (order_id, tenant_id, order_date, customer_id, total_amount, status, payment_method, outlet_id, processed_by, notes, order_reference, charge_percentage, charge_amount, discount_fee, cash_received, cash_balance, to_be_delivered, delivery_address, amount_to_pay, paid_status, is_credit, total_amount_due, total_amount_remaining, expected_payment_date, transaction_from) FROM stdin;
    public          bwilliam    false    220   �N      �          0    49478    outlet 
   TABLE DATA           :  COPY public.outlet (outlet_id, outlet_name, tenant_id, is_main_outlet, outlet_description, outlet_address_line1, outlet_address_line2, outlet_city, outlet_state_province, outlet_postal_code, outlet_country, outlet_phone, outlet_email, opening_hours, website_url, created_at, is_electronic, updated_at) FROM stdin;
    public          bwilliam    false    221   P      �          0    50697    outlet_api_keys 
   TABLE DATA           `   COPY public.outlet_api_keys (api_key_id, outlet_id, api_key, created_at, tenant_id) FROM stdin;
    public          bwilliam    false    240   R      �          0    49488    outlet_inventory 
   TABLE DATA           �   COPY public.outlet_inventory (outlet_inventory_id, outlet_id, product_id, stock_quantity, min_stock_threshold, max_stock_threshold, last_restock_date, last_stock_transfer_date, tenant_id, created_at, processed_by, transfer_id) FROM stdin;
    public          bwilliam    false    222   �R      �          0    49497    product 
   TABLE DATA             COPY public.product (product_id, prod_name, prod_desc, prod_price, cos_price, prod_pic, cat_id, prod_qty, reorder, supplier_id, tenant_id, serial, created_at, updated_at, brand_id, unit_id, pack_name, retail_price, wholesale_price, expiry_date) FROM stdin;
    public          bwilliam    false    223   �S      �          0    49508    product_variants 
   TABLE DATA           �   COPY public.product_variants (variant_id, product_id, variant_name, price_adjustment, stock_quantity, weight, dimensions, color, size, is_available, date_added, date_modified) FROM stdin;
    public          bwilliam    false    224   �T      �          0    49514    products 
   TABLE DATA           �   COPY public.products (product_id, product_name, description, price, stock_quantity, is_available, manufacturer, category, weight, dimensions, date_added, date_modified, image_url) FROM stdin;
    public          bwilliam    false    225   �T      �          0    51800 	   promotion 
   TABLE DATA           �   COPY public.promotion (promotion_id, promotion_name, description, start_date, end_date, discount_percent, tenant_id) FROM stdin;
    public          bwilliam    false    246   �T      �          0    52612    salary_allowance 
   TABLE DATA           �   COPY public.salary_allowance (salary_allowance_id, salary_allowance_name, is_taxable, is_flat_rate, flat_rate, is_percentage_rate, percentage_rate, created_at, updated_at, is_deleted, tenant_id, taxable_flat_rate, taxable_percentage_rate) FROM stdin;
    public          bwilliam    false    254   �T      �          0    52590    salary_deduction 
   TABLE DATA           �   COPY public.salary_deduction (salary_deduction_id, salary_deduction_name, is_flat_rate, flat_rate, is_percentage_rate, percentage_rate, created_at, updated_at, is_deleted, tenant_id) FROM stdin;
    public          bwilliam    false    252   U      �          0    51754    shipping_carrier 
   TABLE DATA           Q   COPY public.shipping_carrier (carrier_id, carrier_name, description) FROM stdin;
    public          bwilliam    false    244   0U      �          0    51764    shipping_rate 
   TABLE DATA           e   COPY public.shipping_rate (rate_id, carrier_id, zone_name, min_weight, max_weight, rate) FROM stdin;
    public          bwilliam    false    245   MU      �          0    49522    shop_inventory 
   TABLE DATA           �   COPY public.shop_inventory (inventory_id, shop_id, product_id, stock_quantity, min_stock_threshold, max_stock_threshold, last_restock_date) FROM stdin;
    public          bwilliam    false    226   jU      �          0    49528    shop_user_access 
   TABLE DATA           f   COPY public.shop_user_access (access_id, outlet_id, user_id, role, is_default, tenant_id) FROM stdin;
    public          bwilliam    false    227   �U      �          0    51695    shopping_cart 
   TABLE DATA           _   COPY public.shopping_cart (cart_id, customer_id, product_id, quantity, created_at) FROM stdin;
    public          bwilliam    false    241   3V      �          0    49535 	   suppliers 
   TABLE DATA           �   COPY public.suppliers (supplier_id, supplier_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, created_at, tenant_id, updated_at) FROM stdin;
    public          bwilliam    false    228   PV      �          0    49544    tenants 
   TABLE DATA           3  COPY public.tenants (tenant_id, tenant_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date, subscription_type, subscription_expiry_date, is_active, url, has_electronic, show_electronic_popup) FROM stdin;
    public          bwilliam    false    229   4W      �          0    49553    transfer_acknowledgment 
   TABLE DATA              COPY public.transfer_acknowledgment (acknowledgment_id, transfer_id, received_date, is_confirmed, remarks, status) FROM stdin;
    public          bwilliam    false    230   X      �          0    49563    transfer_stock 
   TABLE DATA           �   COPY public.transfer_stock (transfer_id, source_outlet_id, destination_outlet_id, transfer_date, notes, is_acknowledged, ref_code, reference, processed_by, tenant_id, transfer_from, accept_status) FROM stdin;
    public          bwilliam    false    231   �X      �          0    49573    units 
   TABLE DATA           N   COPY public.units (unit_id, unit_name, abbreviation, description) FROM stdin;
    public          bwilliam    false    232   �Y      �          0    51712    wishlist 
   TABLE DATA           T   COPY public.wishlist (wishlist_id, customer_id, product_id, created_at) FROM stdin;
    public          bwilliam    false    242   Z      �           0    0    order_code_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.order_code_seq', 6, true);
          public          bwilliam    false    233            �           2606    49382    account account_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);
 >   ALTER TABLE ONLY public.account DROP CONSTRAINT account_pkey;
       public            bwilliam    false    209            �           2606    49562 +   transfer_acknowledgment acknowledgment_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.transfer_acknowledgment
    ADD CONSTRAINT acknowledgment_pkey PRIMARY KEY (acknowledgment_id);
 U   ALTER TABLE ONLY public.transfer_acknowledgment DROP CONSTRAINT acknowledgment_pkey;
       public            bwilliam    false    230            �           2606    52574 F   bank_accounts bank_accounts_account_number_account_name_account_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_account_number_account_name_account_id_key UNIQUE (account_number) INCLUDE (account_name, account_id);
 p   ALTER TABLE ONLY public.bank_accounts DROP CONSTRAINT bank_accounts_account_number_account_name_account_id_key;
       public            bwilliam    false    251    251    251            �           2606    52572     bank_accounts bank_accounts_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (bank_account_id);
 J   ALTER TABLE ONLY public.bank_accounts DROP CONSTRAINT bank_accounts_pkey;
       public            bwilliam    false    251            �           2606    52564 (   banks banks_bank_name_code_long_code_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_bank_name_code_long_code_key UNIQUE (bank_name) INCLUDE (code, long_code);
 R   ALTER TABLE ONLY public.banks DROP CONSTRAINT banks_bank_name_code_long_code_key;
       public            bwilliam    false    250    250    250            �           2606    52562    banks banks_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (bank_id);
 :   ALTER TABLE ONLY public.banks DROP CONSTRAINT banks_pkey;
       public            bwilliam    false    250            �           2606    49393    brands brands_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public            bwilliam    false    210            �           2606    49402    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            bwilliam    false    211            �           2606    49409    consignment consignment_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.consignment
    ADD CONSTRAINT consignment_pkey PRIMARY KEY (consignment_id);
 F   ALTER TABLE ONLY public.consignment DROP CONSTRAINT consignment_pkey;
       public            bwilliam    false    212            �           2606    51835    coupon coupon_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT coupon_pkey PRIMARY KEY (coupon_id);
 <   ALTER TABLE ONLY public.coupon DROP CONSTRAINT coupon_pkey;
       public            bwilliam    false    247            �           2606    49418 "   credit_history credit_history_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.credit_history
    ADD CONSTRAINT credit_history_pkey PRIMARY KEY (credit_id);
 L   ALTER TABLE ONLY public.credit_history DROP CONSTRAINT credit_history_pkey;
       public            bwilliam    false    213            �           2606    49429    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public            bwilliam    false    214            �           2606    49431     customers customers_phone_number 
   CONSTRAINT     c   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_number UNIQUE (phone_number);
 J   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_phone_number;
       public            bwilliam    false    214            �           2606    49427    customers customers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            bwilliam    false    214            �           2606    49807     customers customers_username_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_username_key UNIQUE (username);
 J   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_username_key;
       public            bwilliam    false    214            �           2606    49797 ,   ecommerce_addresses ecommerce_addresses_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.ecommerce_addresses
    ADD CONSTRAINT ecommerce_addresses_pkey PRIMARY KEY (address_id);
 V   ALTER TABLE ONLY public.ecommerce_addresses DROP CONSTRAINT ecommerce_addresses_pkey;
       public            bwilliam    false    239            �           2606    49777 &   expense_category expense_category_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.expense_category
    ADD CONSTRAINT expense_category_pkey PRIMARY KEY (category_id);
 P   ALTER TABLE ONLY public.expense_category DROP CONSTRAINT expense_category_pkey;
       public            bwilliam    false    238            �           2606    49759    expenses expenses_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);
 @   ALTER TABLE ONLY public.expenses DROP CONSTRAINT expenses_pkey;
       public            bwilliam    false    236            �           2606    51738    feedback feedback_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);
 @   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_pkey;
       public            bwilliam    false    243            �           2606    49444    fees_charged fees_charged_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.fees_charged
    ADD CONSTRAINT fees_charged_pkey PRIMARY KEY (fees_charged_id);
 H   ALTER TABLE ONLY public.fees_charged DROP CONSTRAINT fees_charged_pkey;
       public            bwilliam    false    216            �           2606    52630 .   group_band_deduction group_band_deduction_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.group_band_deduction
    ADD CONSTRAINT group_band_deduction_pkey PRIMARY KEY (band_deduction_id);
 X   ALTER TABLE ONLY public.group_band_deduction DROP CONSTRAINT group_band_deduction_pkey;
       public            bwilliam    false    255            �           2606    52611    group_band group_band_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.group_band
    ADD CONSTRAINT group_band_pkey PRIMARY KEY (group_band_name);
 D   ALTER TABLE ONLY public.group_band DROP CONSTRAINT group_band_pkey;
       public            bwilliam    false    253            �           2606    49768 $   income_category income_category_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.income_category
    ADD CONSTRAINT income_category_pkey PRIMARY KEY (category_id);
 N   ALTER TABLE ONLY public.income_category DROP CONSTRAINT income_category_pkey;
       public            bwilliam    false    237            �           2606    49751    income income_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (income_id);
 <   ALTER TABLE ONLY public.income DROP CONSTRAINT income_pkey;
       public            bwilliam    false    235            �           2606    49453    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public            bwilliam    false    217            �           2606    49460    item_unit item_unit_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.item_unit
    ADD CONSTRAINT item_unit_pkey PRIMARY KEY (unit_type);
 B   ALTER TABLE ONLY public.item_unit DROP CONSTRAINT item_unit_pkey;
       public            bwilliam    false    218            �           2606    49467    order_items order_items_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            bwilliam    false    219            �           2606    51890 $   order_shipments order_shipments_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.order_shipments
    ADD CONSTRAINT order_shipments_pkey PRIMARY KEY (shipment_id);
 N   ALTER TABLE ONLY public.order_shipments DROP CONSTRAINT order_shipments_pkey;
       public            bwilliam    false    249            �           2606    49477    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            bwilliam    false    220            �           2606    50705 $   outlet_api_keys outlet_api_keys_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.outlet_api_keys
    ADD CONSTRAINT outlet_api_keys_pkey PRIMARY KEY (api_key_id);
 N   ALTER TABLE ONLY public.outlet_api_keys DROP CONSTRAINT outlet_api_keys_pkey;
       public            bwilliam    false    240            �           2606    49728 +   credit_payments outlet_credit_payments_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.credit_payments
    ADD CONSTRAINT outlet_credit_payments_pkey PRIMARY KEY (payment_id);
 U   ALTER TABLE ONLY public.credit_payments DROP CONSTRAINT outlet_credit_payments_pkey;
       public            bwilliam    false    234            �           2606    49496 &   outlet_inventory outlet_inventory_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.outlet_inventory
    ADD CONSTRAINT outlet_inventory_pkey PRIMARY KEY (outlet_inventory_id);
 P   ALTER TABLE ONLY public.outlet_inventory DROP CONSTRAINT outlet_inventory_pkey;
       public            bwilliam    false    222            �           2606    49507    product product_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public            bwilliam    false    223            �           2606    49513 &   product_variants product_variants_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (variant_id);
 P   ALTER TABLE ONLY public.product_variants DROP CONSTRAINT product_variants_pkey;
       public            bwilliam    false    224            �           2606    49521    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            bwilliam    false    225            �           2606    51807    promotion promotion_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (promotion_id);
 B   ALTER TABLE ONLY public.promotion DROP CONSTRAINT promotion_pkey;
       public            bwilliam    false    246            �           2606    52622 &   salary_allowance salary_allowance_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.salary_allowance
    ADD CONSTRAINT salary_allowance_pkey PRIMARY KEY (salary_allowance_id);
 P   ALTER TABLE ONLY public.salary_allowance DROP CONSTRAINT salary_allowance_pkey;
       public            bwilliam    false    254            �           2606    52601 &   salary_deduction salary_deduction_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.salary_deduction
    ADD CONSTRAINT salary_deduction_pkey PRIMARY KEY (salary_deduction_id);
 P   ALTER TABLE ONLY public.salary_deduction DROP CONSTRAINT salary_deduction_pkey;
       public            bwilliam    false    252            �           2606    51761 &   shipping_carrier shipping_carrier_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.shipping_carrier
    ADD CONSTRAINT shipping_carrier_pkey PRIMARY KEY (carrier_id);
 P   ALTER TABLE ONLY public.shipping_carrier DROP CONSTRAINT shipping_carrier_pkey;
       public            bwilliam    false    244            �           2606    51769     shipping_rate shipping_rate_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.shipping_rate
    ADD CONSTRAINT shipping_rate_pkey PRIMARY KEY (rate_id);
 J   ALTER TABLE ONLY public.shipping_rate DROP CONSTRAINT shipping_rate_pkey;
       public            bwilliam    false    245            �           2606    49527 "   shop_inventory shop_inventory_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_pkey PRIMARY KEY (inventory_id);
 L   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_pkey;
       public            bwilliam    false    226            �           2606    49534 &   shop_user_access shop_user_access_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_pkey PRIMARY KEY (access_id);
 P   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_pkey;
       public            bwilliam    false    227            �           2606    51701     shopping_cart shopping_cart_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_pkey PRIMARY KEY (cart_id);
 J   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_pkey;
       public            bwilliam    false    241            �           2606    49487    outlet shops_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.outlet
    ADD CONSTRAINT shops_pkey PRIMARY KEY (outlet_id);
 ;   ALTER TABLE ONLY public.outlet DROP CONSTRAINT shops_pkey;
       public            bwilliam    false    221            �           2606    49543    suppliers suppliers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);
 B   ALTER TABLE ONLY public.suppliers DROP CONSTRAINT suppliers_pkey;
       public            bwilliam    false    228            �           2606    49552    tenants tenants_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);
 >   ALTER TABLE ONLY public.tenants DROP CONSTRAINT tenants_pkey;
       public            bwilliam    false    229            �           2606    49572 !   transfer_stock transfer_data_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.transfer_stock
    ADD CONSTRAINT transfer_data_pkey PRIMARY KEY (transfer_id);
 K   ALTER TABLE ONLY public.transfer_stock DROP CONSTRAINT transfer_data_pkey;
       public            bwilliam    false    231            �           2606    51763     shipping_carrier uc_carrier_name 
   CONSTRAINT     c   ALTER TABLE ONLY public.shipping_carrier
    ADD CONSTRAINT uc_carrier_name UNIQUE (carrier_name);
 J   ALTER TABLE ONLY public.shipping_carrier DROP CONSTRAINT uc_carrier_name;
       public            bwilliam    false    244            �           2606    49384    account uniqueuser 
   CONSTRAINT     _   ALTER TABLE ONLY public.account
    ADD CONSTRAINT uniqueuser UNIQUE (username, email, phone);
 <   ALTER TABLE ONLY public.account DROP CONSTRAINT uniqueuser;
       public            bwilliam    false    209    209    209            �           2606    49580    units units_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (unit_id);
 :   ALTER TABLE ONLY public.units DROP CONSTRAINT units_pkey;
       public            bwilliam    false    232            �           2606    51718    wishlist wishlist_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (wishlist_id);
 @   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_pkey;
       public            bwilliam    false    242            �           1259    49739 &   idx_outlet_credit_payments_customer_id    INDEX     i   CREATE INDEX idx_outlet_credit_payments_customer_id ON public.credit_payments USING btree (customer_id);
 :   DROP INDEX public.idx_outlet_credit_payments_customer_id;
       public            bwilliam    false    234            �           1259    49740 $   idx_outlet_credit_payments_outlet_id    INDEX     e   CREATE INDEX idx_outlet_credit_payments_outlet_id ON public.credit_payments USING btree (outlet_id);
 8   DROP INDEX public.idx_outlet_credit_payments_outlet_id;
       public            bwilliam    false    234                       2606    49651 7   transfer_acknowledgment acknowledgment_transfer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transfer_acknowledgment
    ADD CONSTRAINT acknowledgment_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.transfer_stock(transfer_id);
 a   ALTER TABLE ONLY public.transfer_acknowledgment DROP CONSTRAINT acknowledgment_transfer_id_fkey;
       public          bwilliam    false    3785    231    230            #           2606    52580 +   bank_accounts bank_accounts_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id);
 U   ALTER TABLE ONLY public.bank_accounts DROP CONSTRAINT bank_accounts_account_id_fkey;
       public          bwilliam    false    251    3735    209            $           2606    52575 (   bank_accounts bank_accounts_bank_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_bank_id_fkey FOREIGN KEY (bank_id) REFERENCES public.banks(bank_id);
 R   ALTER TABLE ONLY public.bank_accounts DROP CONSTRAINT bank_accounts_bank_id_fkey;
       public          bwilliam    false    3825    250    251            %           2606    52585 *   bank_accounts bank_accounts_tenant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 T   ALTER TABLE ONLY public.bank_accounts DROP CONSTRAINT bank_accounts_tenant_id_fkey;
       public          bwilliam    false    229    251    3781            �           2606    49586 '   consignment consignment_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.consignment
    ADD CONSTRAINT consignment_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);
 Q   ALTER TABLE ONLY public.consignment DROP CONSTRAINT consignment_product_id_fkey;
       public          bwilliam    false    223    3769    212                        2606    49591 (   consignment consignment_transfer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.consignment
    ADD CONSTRAINT consignment_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.transfer_stock(transfer_id);
 R   ALTER TABLE ONLY public.consignment DROP CONSTRAINT consignment_transfer_id_fkey;
       public          bwilliam    false    3785    212    231                       2606    49596 .   credit_history credit_history_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_history
    ADD CONSTRAINT credit_history_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 X   ALTER TABLE ONLY public.credit_history DROP CONSTRAINT credit_history_customer_id_fkey;
       public          bwilliam    false    3751    213    214                       2606    49601 +   credit_history credit_history_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_history
    ADD CONSTRAINT credit_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 U   ALTER TABLE ONLY public.credit_history DROP CONSTRAINT credit_history_order_id_fkey;
       public          bwilliam    false    220    213    3763                       2606    49798 8   ecommerce_addresses ecommerce_addresses_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ecommerce_addresses
    ADD CONSTRAINT ecommerce_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 b   ALTER TABLE ONLY public.ecommerce_addresses DROP CONSTRAINT ecommerce_addresses_customer_id_fkey;
       public          bwilliam    false    239    3751    214                       2606    51739 "   feedback feedback_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 L   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_customer_id_fkey;
       public          bwilliam    false    3751    214    243                       2606    51770    shipping_rate fk_carrier    FK CONSTRAINT     �   ALTER TABLE ONLY public.shipping_rate
    ADD CONSTRAINT fk_carrier FOREIGN KEY (carrier_id) REFERENCES public.shipping_carrier(carrier_id);
 B   ALTER TABLE ONLY public.shipping_rate DROP CONSTRAINT fk_carrier;
       public          bwilliam    false    244    245    3811                       2606    51855 (   customer_promotion_usage fk_coupon_usage    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_promotion_usage
    ADD CONSTRAINT fk_coupon_usage FOREIGN KEY (coupon_id) REFERENCES public.coupon(coupon_id);
 R   ALTER TABLE ONLY public.customer_promotion_usage DROP CONSTRAINT fk_coupon_usage;
       public          bwilliam    false    3819    248    247                       2606    51845 $   customer_promotion_usage fk_customer    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_promotion_usage
    ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 N   ALTER TABLE ONLY public.customer_promotion_usage DROP CONSTRAINT fk_customer;
       public          bwilliam    false    248    214    3751                       2606    51744    feedback fk_feedback_customer    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_feedback_customer FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 G   ALTER TABLE ONLY public.feedback DROP CONSTRAINT fk_feedback_customer;
       public          bwilliam    false    3751    243    214                       2606    51749    feedback fk_feedback_order    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT fk_feedback_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 D   ALTER TABLE ONLY public.feedback DROP CONSTRAINT fk_feedback_order;
       public          bwilliam    false    3763    243    220                       2606    51836    coupon fk_promotion    FK CONSTRAINT     �   ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT fk_promotion FOREIGN KEY (promotion_id) REFERENCES public.promotion(promotion_id);
 =   ALTER TABLE ONLY public.coupon DROP CONSTRAINT fk_promotion;
       public          bwilliam    false    247    246    3817                       2606    51850 +   customer_promotion_usage fk_promotion_usage    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_promotion_usage
    ADD CONSTRAINT fk_promotion_usage FOREIGN KEY (promotion_id) REFERENCES public.promotion(promotion_id);
 U   ALTER TABLE ONLY public.customer_promotion_usage DROP CONSTRAINT fk_promotion_usage;
       public          bwilliam    false    246    248    3817                       2606    51808    promotion fk_tenant    FK CONSTRAINT     }   ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 =   ALTER TABLE ONLY public.promotion DROP CONSTRAINT fk_tenant;
       public          bwilliam    false    246    3781    229                        2606    51901 /   order_shipments order_shipments_carrier_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_shipments
    ADD CONSTRAINT order_shipments_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES public.shipping_carrier(carrier_id);
 Y   ALTER TABLE ONLY public.order_shipments DROP CONSTRAINT order_shipments_carrier_id_fkey;
       public          bwilliam    false    3811    249    244            !           2606    51896 8   order_shipments order_shipments_customer_address_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_shipments
    ADD CONSTRAINT order_shipments_customer_address_id_fkey FOREIGN KEY (customer_address_id) REFERENCES public.ecommerce_addresses(address_id);
 b   ALTER TABLE ONLY public.order_shipments DROP CONSTRAINT order_shipments_customer_address_id_fkey;
       public          bwilliam    false    239    3801    249            "           2606    51891 -   order_shipments order_shipments_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_shipments
    ADD CONSTRAINT order_shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 W   ALTER TABLE ONLY public.order_shipments DROP CONSTRAINT order_shipments_order_id_fkey;
       public          bwilliam    false    220    3763    249                       2606    49606    orders orders_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 H   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_customer_id_fkey;
       public          bwilliam    false    220    3751    214                       2606    50706 .   outlet_api_keys outlet_api_keys_outlet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outlet_api_keys
    ADD CONSTRAINT outlet_api_keys_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlet(outlet_id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.outlet_api_keys DROP CONSTRAINT outlet_api_keys_outlet_id_fkey;
       public          bwilliam    false    3765    240    221                       2606    49729 7   credit_payments outlet_credit_payments_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_payments
    ADD CONSTRAINT outlet_credit_payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 a   ALTER TABLE ONLY public.credit_payments DROP CONSTRAINT outlet_credit_payments_customer_id_fkey;
       public          bwilliam    false    234    3751    214                       2606    49734 5   credit_payments outlet_credit_payments_outlet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credit_payments
    ADD CONSTRAINT outlet_credit_payments_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlet(outlet_id);
 _   ALTER TABLE ONLY public.credit_payments DROP CONSTRAINT outlet_credit_payments_outlet_id_fkey;
       public          bwilliam    false    234    3765    221                       2606    49616 0   outlet_inventory outlet_inventory_outlet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outlet_inventory
    ADD CONSTRAINT outlet_inventory_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlet(outlet_id);
 Z   ALTER TABLE ONLY public.outlet_inventory DROP CONSTRAINT outlet_inventory_outlet_id_fkey;
       public          bwilliam    false    221    222    3765                       2606    49621 1   outlet_inventory outlet_inventory_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outlet_inventory
    ADD CONSTRAINT outlet_inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);
 [   ALTER TABLE ONLY public.outlet_inventory DROP CONSTRAINT outlet_inventory_product_id_fkey;
       public          bwilliam    false    222    3769    223                       2606    49626 1   product_variants product_variants_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 [   ALTER TABLE ONLY public.product_variants DROP CONSTRAINT product_variants_product_id_fkey;
       public          bwilliam    false    224    225    3773                       2606    49631 -   shop_inventory shop_inventory_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 W   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_product_id_fkey;
       public          bwilliam    false    226    225    3773            	           2606    49636 *   shop_inventory shop_inventory_shop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.outlet(outlet_id);
 T   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_shop_id_fkey;
       public          bwilliam    false    221    226    3765            
           2606    49641 .   shop_user_access shop_user_access_shop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_shop_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlet(outlet_id);
 X   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_shop_id_fkey;
       public          bwilliam    false    3765    221    227                       2606    49646 .   shop_user_access shop_user_access_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(account_id);
 X   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_user_id_fkey;
       public          bwilliam    false    3735    209    227                       2606    51702 ,   shopping_cart shopping_cart_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 V   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_customer_id_fkey;
       public          bwilliam    false    241    214    3751                       2606    51707 +   shopping_cart shopping_cart_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 U   ALTER TABLE ONLY public.shopping_cart DROP CONSTRAINT shopping_cart_product_id_fkey;
       public          bwilliam    false    3773    225    241                       2606    49611    outlet shops_tenant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outlet
    ADD CONSTRAINT shops_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 E   ALTER TABLE ONLY public.outlet DROP CONSTRAINT shops_tenant_id_fkey;
       public          bwilliam    false    3781    229    221            �           2606    49581    account tenantkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.account
    ADD CONSTRAINT tenantkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 ;   ALTER TABLE ONLY public.account DROP CONSTRAINT tenantkey;
       public          bwilliam    false    209    3781    229                       2606    49656 7   transfer_stock transfer_data_destination_outlet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transfer_stock
    ADD CONSTRAINT transfer_data_destination_outlet_id_fkey FOREIGN KEY (destination_outlet_id) REFERENCES public.outlet(outlet_id);
 a   ALTER TABLE ONLY public.transfer_stock DROP CONSTRAINT transfer_data_destination_outlet_id_fkey;
       public          bwilliam    false    231    221    3765                       2606    49661 2   transfer_stock transfer_data_source_outlet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transfer_stock
    ADD CONSTRAINT transfer_data_source_outlet_id_fkey FOREIGN KEY (source_outlet_id) REFERENCES public.outlet(outlet_id);
 \   ALTER TABLE ONLY public.transfer_stock DROP CONSTRAINT transfer_data_source_outlet_id_fkey;
       public          bwilliam    false    3765    221    231                       2606    51719 "   wishlist wishlist_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 L   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_customer_id_fkey;
       public          bwilliam    false    3751    242    214                       2606    51724 !   wishlist wishlist_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);
 K   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_product_id_fkey;
       public          bwilliam    false    242    3769    223            �   N  x����N�@���)X�#Ӝ��3�J)�@�\Ԃ��L�)�􂀂>��!1�3�_���9�ǈ/�� 'T�5h,��0x)W�s
J!��)fp�-�`Xf�bI%�%a�@�fS?g��^\�\���v�qӦBB�|!��-��m�P��Z���u�p����V�Z���i�&���|08�jޟ�/,�h�6}7#z�0�����53w�
ł�X�?N�=Iʱ�9�<Q9�9טp��	�$������}s�Ѯ+]��
͋�A��,]~�Ih��H���Q\�6���{�{�1�հ*�io71��Y����N��R���mո>7��|YW��8��f��      �      x������ � �      �      x������ � �      �   �   x�Ľ�0 �}
ws��w�l� �qci�m$* ��M��O7�M[��B�!��EbCX�P����.yKK���~����Cם�Rf���Ƕ.3�׏ �P����*8�-�R���m�0h,h����s�X���b夤�?�>,U      �   l   x�̱!F���>��Ƙ"\�(]��_�Ez�g}J� ��&-*4y*˫��X����Ɲ��?3��4aA�LΎ�Ë�,T@��d=�UY�E����,n'      �   �   x����qE1c�*�{x�On-N���/�r�Ё�=,빤+`� �pH�
cb��l��Y��P��H��qz����s
�n;�\����C���R��4nf�;�`��ņ���{˱"��f�]
ĠJ�E821I#�����Qy��Q|"6!s��09��N���/We�x�J؆�;@/ ��`>bp�u�-Ε�_��ȃ
�������� ���
_�������|��1�w�s����z}��x�      �      x������ � �      �   #  x�͐�n�1�g�O��"�1�!�t��V�J�ڼ�ꤪ�v���-l��a1���AФR�=[�L3
1-��� ��`�l_��ʼ�.YyL�$ X\Y�3Ybs���2ٽ<zF�@O$�b��gdW�"椊6}_��q��`3�ÛQ^5�sq�I��"�"��`�����u5ԉ�5ߢ�vL,C�D��K{������>n�=>��9ݎά�:�,G�.
�}�L�"��X���bA5n�Ii���Vp��o`߼�Q��m(t�r�r:[�*����z>��xU��      �     x�Ֆ��1��٧�Р�-�����i|�IXH���!�l�n����|�r.1�5��JoⰚ�$˅���FL���1@�x�_#�D[��(���K�F����t0� !�'����_Ϭoߟ_��kϟ�:F���x��	>�|Rs���"����?[=����,&���,]2f���X�p���2���X�[�ӚMz-Ѧm�З�'iu�����@`:�H�uY�(N,B�5�Ä���Z$l���Z���pR#�jC5#�c� ��W��@(gE�*�!��*] �7оOkS;�2Pg��w�ৢ��e�(S�`��$l
Ш*��諷�Y�!���U/C�cPGލa��B�ށ}bNiz�$�P��CX�j��XqK���<j��`�Ew�@�Z�w$AI�}B��˪����;%��w��O1U����$;;Xϭ�}q��Z��!}ޅ��,��z_\T��O���_v�sC��:8���~zb�]�0Gۑ�և����6���+�H����jx{?���TT��OOO���      �      x������ � �      �   s  x��P�N�0\;_�Ew����]Q�Z�z٠n\���&.������a��Y��yHgjP�������%F &x�uA��f]�]�f3�rU>}��]ە>��q!����h��p��l7��À�ڴ����%@J
ξ��mjt~���4�s9�Ž����ۦ&�����1d�ؐW�� ��߸�q�a�����j*�R)��8��Hkjj��\SD�JS'�
�&Bu��E��`='��H�X�j�DD�,0e�M�֦��{F4�5���یE����i 	ͼ�og��0�Se�R��&�3J��0:��v���<�����%}�@���c���^�����ί�����<��㛶X�EQ����      �   {   x�=�;�0 �99E.`��|�\�va͒Ď�ԂT���o|��@(��>t�ƒ`h�T}LUʚ;�t���2� ����� ��n���Cu�����]���ǔ�τ���C��}Ym9Yk�9�&      �   �   x�]�;�0 �99E.�ʎ����0q�.i�
�B�R$�=#o}�+%l"8�H���AH�-*�"漿�^�����s���v��_������x����a	q�(��_��f��17a���!7��}F����d��Z�u�-      �   �   x���;jAEѸg�@�뮮Y�W���9�o'v x����0�n��bP��Q���r�6JIk~^n�|�Hw���� �����A�������J�:\&4,M���P����$�Ґ Á�����c�� P���o����<V�0�\�c�1<w�OT���w+j����5�6��h�ѧBˍ�G�����.��eۅ�h�u�X_��۶}J<�U      �      x������ � �      �      x������ � �      �   _  x��ѻ�AP{6���m����#�Q��p	l �z`�Qؚ
��Ai��2e�}�Ey3^��P��TA57d)�
��dO����S����LYб-Pt���!8pe����A��M�f���*�@|���jx�/96N�A	>���I���n=�����6�&�U��e���>���o'��#:�z��M��
�"V�H��vem=@���4��pR�F�6���j�t��� Dt�(̡��(������[�l����;�v��)dh���c>�xK�Q���9�񠀢�����jG��Ҥ�e6��X<�@{�#ӂ�R�s�{�@F�����t�)�<�������>�)      �      x������ � �      �      x������ � �      �      x������ � �      �   Y  x���Ij�1�u�)��S�JUՇ�	�)M`pBor��7���a����Y0�[�ʫ@��3Ȓ�i����������<��<���Ĉ��X��ő�/*���|}[ʅ����T+��аN(h>&���t�e'f��P ;()9� Z��f��y���Ő��'�B�p��2:j�9�~�r�!�b�/P��]P%/���_�s�N��~�Z����sf�iߪ����G%R�{����+�鞔�!K���X1te�j���*��Pw�U�:�~4W�FC c.�{���������.]+W5��]��'ݺ�֫��5X�xG]��wl��,��=؏��|��:      �   �   x�]�=�0�99E.����&N� � ]��J������X�d�,�`�)�6�L\�����9�|�����G��m?��H���$L*I����3��W^�a=�R�z�AW.�2W%�d0�Mt�q�b�_�&x      �   �   x�%̱�0�Z�"}@㛤(2Cd�4�(�?B����r�h�6Hm/�<�2��E�]�e���0�I����i�duYɱ�3x�,�u�&乘�+�_�[a��< /���i������*r��48�UG'_�:5\�����<��=G.�      �   N   x����0�:La��} `�!� �p���:����k���S9����R����E��6l��1ď��;P�E� �Τ�      �   ;  x�ݒ��eAD�~Q���K7�u���C�~�&1���P<N���*�qB��k��9��SY=@b�YV`H���Nڛ�^ŀ�/��0v8k����Y��0>���'[�x��.��6,J9�$�掱��^(�a<9��z�@���B�������m#�rX��[B��ZY����1� !����_��CS���hvT_ B|�a���DV��t7/-Y�A7�����,�]�{��+���.�F��緢���s�,�xvU�l��8=x�N�+L�.�p/�}�6aH?h/۫�Pv�����|>� �      �      x������ � �      �   �  x��ҽn1 �Y~
� �DR�m-�h�.�m$����Wg�u�dH��I}R�� X1�,Ґ�TG,��SEk)t(�c k݃yÞ�Q�y�!��x��"/jH��u!OC��Z�U��v6j!��p��������/��|~p��$b�mr������:{!$h�цP|�E3X�(��1{L���~�{�<��r,���}���X" ����;]��x���/�C�/y��-=��憻\õ`p�{�����#Ԧ��xÛ��u.K*[�w¶Y$����}���?}��Kx�{��g�������h>�	�jY�U���x6�=��eeZ(y�w	���=��C`/���A�~�7m��o�k0�a�e��v? ���      �   �  x�ՔM�!�����t(��蓣Ycfc�z�K�k=�f���g�Ĭь7%\(�7U/h':�2mud�ɜ��yp2z������B?ƌ��w��#�L�sc!Zsj.��U�W�`VXZ��!�/C�k��I���]�c]�nɛT�}M��E��r*1�,q!/�	�ic'��!�a���Ocl�t$�)��sꩣ�-eT�ۗ�KO�?�T�}-�\�Jٷ�q9���Z��B2�Lr�e/d�uRgk3����P�z������x�@
��9Un9�"��},	�~��ױ+dC�Kgt9L'���t*i�-���x|�R���O�.�ȅ� ��� <�g ��<CezٵV8��ߠ��gNV�)��!��tT� �A	M6�_�ȗ���t��a��~�KQ�o�1j��ۦ��#�f�SXM<��5��a0`|�l�t�p��\ɵ0��\�@u��;�*):���4��i��bmC�      �   �   x���N�P �u�.��:3�1��3h �4&���G�`c�_��d�9Q����`aP�0�1&O�q���zp�*X*����QH�?i:NaW.�/�yw؞��t\�����������A���ʯ����}��e�}y�# ������!y���J4�
�@(�!p�5����۶��=6       �   �   x���m�1��*r�Xc�"R�^�������H����-���$MK��Fc�#���(҂�����R�ڴ8j.�dpi���#�%N
�ݝrmQ��%N���}��1����W�U}���]��\O/�Ġ��w�7�W5������W�iAhK�U%N2D�_r)=4���;$�d���z��	�?a      �   �   x���KN1@יSt�<�'�8='�&Ǩ�ڪ��E`KV��x��E�i�l���ocw�&ùF��?F�����3	㊘�~�s\��	�h^e@G��	�c�Q����qo�O �\t�J���ޒ�.��f	Ȕ:Gr+��3H�$�T�h��BU��5܃v��Rҟ��8�� x@9
)��涾�O��K��`��O��Qug��+�T���MmV���3t���U�3eeO����7R��˸��eY� �g`�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x���1nD1���./����r�m ���*�W�L�~�Y$t�����f�M)���)��>��0mn���Z(v�E;��	O���������F��j'���^����_�z���>q�$3�ɰ.7����a�]��(4� �X#y+�r���u���=u      �      x������ � �      �   �   x�mO�n�0�/_�=�s��fje�Ѕ5�� "��	�ߗ.���<��*)}�4w�Dnl�<8ixm��$�c��3�Ԥ�4��_S7��ާn;����ӻ%�����.�aGV��<��`�'�+A����^�Wr���[��J�h%_�P����8�m�-+�OI��B�B9!u���C�&^�#n0��GR�+�*/u���;��,�~xYVK      �   �   x�%��n�0�盧��l�:jY�ԪRڍ�$b��_���k�����w��vh5�4�7�����UVb�l��<�D������8���,�q�?n�M(�8êVz�d�JȒ�9XGwD���	YN���﷟&��!�|���X	F�[ڮ�˲�T �ʋ�QRi^K^����3߁�����|��ťѣ~�����?%J�      �   �   x�u�1j1��>���I�=Ҝeٖ!�Br��"M*}ć��S;E'H�
�L���Q{W�^9��ƅZ79�VP>cVQ�# ��ԫ�Ex�5U~"�;�}��3�c�1C�9��R4Y��"8���ҖGc߸d+y�����B���4����At��<��d�?�ǈ�;����7T�E�      �     x���1O1��ܯ�\َ��o	�@*H,,��R�ڢ�}����'��}�5s$�<[�zrP�%�2G�8�B�� 6F0�*Y�>R��)v\N#U�E���	�R��F�@W�S���:!�D�a��ḫo��l����67�|����[@M�	~�����l��sC��ƥԳ�*�"�f!gԶ0Ì_Cp��yY��V�bé��u�q��r?X_�Y��Na�P:
�>7c�ٓ����/?DS�Ihm"��O?W�@Q����Z���mxY��	X2��      �      x������ � �      �      x������ � �     