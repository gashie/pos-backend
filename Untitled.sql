toc.dat                                                                                             0000600 0004000 0002000 00000056103 14513613455 0014453 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP                       	    {            shopdb    14.7    15.0 >    s           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         t           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         u           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         v           1262    33069    shopdb    DATABASE     r   CREATE DATABASE shopdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE shopdb;
                bwilliam    false                     2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false         w           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    4         �            1259    33255    account    TABLE       CREATE TABLE public.account (
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
       public         heap    bwilliam    false    4         �            1259    33188    brands    TABLE     �   CREATE TABLE public.brands (
    brand_id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_name character varying(255) NOT NULL,
    description text,
    origin_country character varying(100),
    website_url character varying(255)
);
    DROP TABLE public.brands;
       public         heap    bwilliam    false    4         �            1259    33196 
   categories    TABLE     �   CREATE TABLE public.categories (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(255) NOT NULL,
    parent_category_id uuid,
    description text
);
    DROP TABLE public.categories;
       public         heap    bwilliam    false    4         �            1259    33146 	   customers    TABLE       CREATE TABLE public.customers (
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state_province character varying(100),
    postal_code character varying(20),
    country character varying(100),
    registration_date date
);
    DROP TABLE public.customers;
       public         heap    bwilliam    false    4         �            1259    33172    order_items    TABLE       CREATE TABLE public.order_items (
    order_item_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL
);
    DROP TABLE public.order_items;
       public         heap    bwilliam    false    4         �            1259    33156    orders    TABLE     B  CREATE TABLE public.orders (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    order_date timestamp without time zone NOT NULL,
    customer_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) NOT NULL,
    payment_method character varying(50)
);
    DROP TABLE public.orders;
       public         heap    bwilliam    false    4         �            1259    33101    product_variants    TABLE     �  CREATE TABLE public.product_variants (
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
       public         heap    bwilliam    false    4         �            1259    33093    products    TABLE       CREATE TABLE public.products (
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
       public         heap    bwilliam    false    4         �            1259    33119    shop_inventory    TABLE     /  CREATE TABLE public.shop_inventory (
    inventory_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    product_id uuid NOT NULL,
    stock_quantity integer NOT NULL,
    min_stock_threshold integer NOT NULL,
    max_stock_threshold integer NOT NULL,
    last_restock_date date
);
 "   DROP TABLE public.shop_inventory;
       public         heap    bwilliam    false    4         �            1259    33280    shop_user_access    TABLE     �   CREATE TABLE public.shop_user_access (
    access_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(20) NOT NULL,
    is_default boolean DEFAULT true,
    tenant_id uuid
);
 $   DROP TABLE public.shop_user_access;
       public         heap    bwilliam    false    4         �            1259    33079    shops    TABLE     �  CREATE TABLE public.shops (
    shop_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_name character varying(255) NOT NULL,
    tenant_id uuid NOT NULL,
    is_main_shop boolean NOT NULL,
    shop_description text,
    shop_address_line1 character varying(255),
    shop_address_line2 character varying(255),
    shop_city character varying(100),
    shop_state_province character varying(100),
    shop_postal_code character varying(20),
    shop_country character varying(100),
    shop_phone character varying(20),
    shop_email character varying(255),
    opening_hours character varying(255),
    website_url character varying(255),
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.shops;
       public         heap    bwilliam    false    4         �            1259    33272 	   suppliers    TABLE     9  CREATE TABLE public.suppliers (
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
    registration_date date
);
    DROP TABLE public.suppliers;
       public         heap    bwilliam    false    4         �            1259    33070    tenants    TABLE     �  CREATE TABLE public.tenants (
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
    url text
);
    DROP TABLE public.tenants;
       public         heap    bwilliam    false    4         �            1259    33209    units    TABLE     �   CREATE TABLE public.units (
    unit_id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_name character varying(50) NOT NULL,
    abbreviation character varying(20),
    description text
);
    DROP TABLE public.units;
       public         heap    bwilliam    false    4         n          0    33255    account 
   TABLE DATA           �   COPY public.account (account_id, tenant_id, username, email, phone, first_name, last_name, is_verified, is_active, created_at, updated_at, role, password, deleted_at) FROM stdin;
    public          bwilliam    false    220       3694.dat k          0    33188    brands 
   TABLE DATA           `   COPY public.brands (brand_id, brand_name, description, origin_country, website_url) FROM stdin;
    public          bwilliam    false    217       3691.dat l          0    33196 
   categories 
   TABLE DATA           a   COPY public.categories (category_id, category_name, parent_category_id, description) FROM stdin;
    public          bwilliam    false    218       3692.dat h          0    33146 	   customers 
   TABLE DATA           �   COPY public.customers (customer_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state_province, postal_code, country, registration_date) FROM stdin;
    public          bwilliam    false    214       3688.dat j          0    33172    order_items 
   TABLE DATA           m   COPY public.order_items (order_item_id, order_id, product_id, quantity, unit_price, total_price) FROM stdin;
    public          bwilliam    false    216       3690.dat i          0    33156    orders 
   TABLE DATA           r   COPY public.orders (order_id, shop_id, order_date, customer_id, total_amount, status, payment_method) FROM stdin;
    public          bwilliam    false    215       3689.dat f          0    33101    product_variants 
   TABLE DATA           �   COPY public.product_variants (variant_id, product_id, variant_name, price_adjustment, stock_quantity, weight, dimensions, color, size, is_available, date_added, date_modified) FROM stdin;
    public          bwilliam    false    212       3686.dat e          0    33093    products 
   TABLE DATA           �   COPY public.products (product_id, product_name, description, price, stock_quantity, is_available, manufacturer, category, weight, dimensions, date_added, date_modified, image_url) FROM stdin;
    public          bwilliam    false    211       3685.dat g          0    33119    shop_inventory 
   TABLE DATA           �   COPY public.shop_inventory (inventory_id, shop_id, product_id, stock_quantity, min_stock_threshold, max_stock_threshold, last_restock_date) FROM stdin;
    public          bwilliam    false    213       3687.dat p          0    33280    shop_user_access 
   TABLE DATA           d   COPY public.shop_user_access (access_id, shop_id, user_id, role, is_default, tenant_id) FROM stdin;
    public          bwilliam    false    222       3696.dat d          0    33079    shops 
   TABLE DATA             COPY public.shops (shop_id, shop_name, tenant_id, is_main_shop, shop_description, shop_address_line1, shop_address_line2, shop_city, shop_state_province, shop_postal_code, shop_country, shop_phone, shop_email, opening_hours, website_url, created_at) FROM stdin;
    public          bwilliam    false    210       3684.dat o          0    33272 	   suppliers 
   TABLE DATA           �   COPY public.suppliers (supplier_id, supplier_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date) FROM stdin;
    public          bwilliam    false    221       3695.dat c          0    33070    tenants 
   TABLE DATA             COPY public.tenants (tenant_id, tenant_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date, subscription_type, subscription_expiry_date, is_active, url) FROM stdin;
    public          bwilliam    false    209       3683.dat m          0    33209    units 
   TABLE DATA           N   COPY public.units (unit_id, unit_name, abbreviation, description) FROM stdin;
    public          bwilliam    false    219       3693.dat �           2606    33263    account account_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);
 >   ALTER TABLE ONLY public.account DROP CONSTRAINT account_pkey;
       public            bwilliam    false    220         �           2606    33195    brands brands_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public            bwilliam    false    217         �           2606    33203    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            bwilliam    false    218         �           2606    33155    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public            bwilliam    false    214         �           2606    33153    customers customers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            bwilliam    false    214         �           2606    33177    order_items order_items_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            bwilliam    false    216         �           2606    33161    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            bwilliam    false    215         �           2606    33106 &   product_variants product_variants_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (variant_id);
 P   ALTER TABLE ONLY public.product_variants DROP CONSTRAINT product_variants_pkey;
       public            bwilliam    false    212         �           2606    33100    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            bwilliam    false    211         �           2606    33124 "   shop_inventory shop_inventory_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_pkey PRIMARY KEY (inventory_id);
 L   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_pkey;
       public            bwilliam    false    213         �           2606    33285 &   shop_user_access shop_user_access_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_pkey PRIMARY KEY (access_id);
 P   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_pkey;
       public            bwilliam    false    222         �           2606    33087    shops shops_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (shop_id);
 :   ALTER TABLE ONLY public.shops DROP CONSTRAINT shops_pkey;
       public            bwilliam    false    210         �           2606    33279    suppliers suppliers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);
 B   ALTER TABLE ONLY public.suppliers DROP CONSTRAINT suppliers_pkey;
       public            bwilliam    false    221         �           2606    33078    tenants tenants_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);
 >   ALTER TABLE ONLY public.tenants DROP CONSTRAINT tenants_pkey;
       public            bwilliam    false    209         �           2606    33265    account uniqueuser 
   CONSTRAINT     _   ALTER TABLE ONLY public.account
    ADD CONSTRAINT uniqueuser UNIQUE (username, email, phone);
 <   ALTER TABLE ONLY public.account DROP CONSTRAINT uniqueuser;
       public            bwilliam    false    220    220    220         �           2606    33216    units units_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (unit_id);
 :   ALTER TABLE ONLY public.units DROP CONSTRAINT units_pkey;
       public            bwilliam    false    219         �           2606    33204 -   categories categories_parent_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id);
 W   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_parent_category_id_fkey;
       public          bwilliam    false    218    218    3521         �           2606    33178 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          bwilliam    false    216    215    3515         �           2606    33183 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          bwilliam    false    211    216    3505         �           2606    33167    orders orders_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);
 H   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_customer_id_fkey;
       public          bwilliam    false    3513    214    215         �           2606    33162    orders orders_shop_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_shop_id_fkey;
       public          bwilliam    false    210    215    3503         �           2606    33107 1   product_variants product_variants_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 [   ALTER TABLE ONLY public.product_variants DROP CONSTRAINT product_variants_product_id_fkey;
       public          bwilliam    false    3505    212    211         �           2606    33130 -   shop_inventory shop_inventory_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 W   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_product_id_fkey;
       public          bwilliam    false    213    211    3505         �           2606    33125 *   shop_inventory shop_inventory_shop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);
 T   ALTER TABLE ONLY public.shop_inventory DROP CONSTRAINT shop_inventory_shop_id_fkey;
       public          bwilliam    false    213    3503    210         �           2606    33286 .   shop_user_access shop_user_access_shop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);
 X   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_shop_id_fkey;
       public          bwilliam    false    222    210    3503         �           2606    33291 .   shop_user_access shop_user_access_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(account_id);
 X   ALTER TABLE ONLY public.shop_user_access DROP CONSTRAINT shop_user_access_user_id_fkey;
       public          bwilliam    false    222    220    3525         �           2606    33088    shops shops_tenant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 D   ALTER TABLE ONLY public.shops DROP CONSTRAINT shops_tenant_id_fkey;
       public          bwilliam    false    3501    210    209         �           2606    33266    account tenantkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.account
    ADD CONSTRAINT tenantkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);
 ;   ALTER TABLE ONLY public.account DROP CONSTRAINT tenantkey;
       public          bwilliam    false    220    209    3501                                                                                                                                                                                                                                                                                                                                                                                                                                                                     3694.dat                                                                                            0000600 0004000 0002000 00000000352 14513613455 0014266 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        24757004-dd1f-4573-8cf3-330651dae6a9	756321c4-aebf-4152-99eb-92068f8609c7	john_doe	john.doe@example.com	+1234567890	John	Doe	t	t	2023-10-16 15:59:14.284078+00	\N	\N	$2b$10$QR25anTYlXiH9oMNstWwG.wkHD9vlFZXjq9iiOnQzBzj5AXje5ir2	\N
\.


                                                                                                                                                                                                                                                                                      3691.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014256 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3692.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3688.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3690.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3689.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3686.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3685.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3687.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014263 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3696.dat                                                                                            0000600 0004000 0002000 00000000241 14513613455 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        3e010b13-39c0-4b92-9126-18f7c53323f5	60891ef4-e355-4db5-be88-f2ce422c1562	24757004-dd1f-4573-8cf3-330651dae6a9	Admin	t	756321c4-aebf-4152-99eb-92068f8609c7
\.


                                                                                                                                                                                                                                                                                                                                                               3684.dat                                                                                            0000600 0004000 0002000 00000001536 14513613455 0014272 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        a4de5818-8545-4f5c-98c8-87bc39f0cbaf	Sample Tenant Inc main shop	756321c4-aebf-4152-99eb-92068f8609c7	f	Sample Tenant Inc first shop	123 Main Street	\N	Cityville	\N	\N	United States	+1234567890	john.doe@example.com	Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM	sampletenantinc.gashie.net	2023-10-16 15:59:14.217799
b60ee33c-f992-4042-beaa-debf1451d5ff	Sample Shop	756321c4-aebf-4152-99eb-92068f8609c7	f	A sample shop description.	456 Elm Street	Unit 789	Cityville	State	12345	United States	+1234567890	shop@example.com	Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM	\N	2023-10-17 03:53:31.275817
60891ef4-e355-4db5-be88-f2ce422c1562	Sample Shop	756321c4-aebf-4152-99eb-92068f8609c7	t	A sample shop description.	456 Elm Street	Unit 789	Cityville	State	12345	United States	+1234567890	shop@example.com	Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM	\N	2023-10-17 03:53:50.198729
\.


                                                                                                                                                                  3695.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3683.dat                                                                                            0000600 0004000 0002000 00000000365 14513613455 0014270 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        756321c4-aebf-4152-99eb-92068f8609c7	Sample Tenant Inc	John Doe	john.doe@example.com	+1234567890	123 Main Street	Suite 456	Cityville	State	12345	United States	https://www.sample-tenant.com	2023-10-16	Premium	\N	t	sampletenantinc.gashie.net
\.


                                                                                                                                                                                                                                                                           3693.dat                                                                                            0000600 0004000 0002000 00000000005 14513613455 0014260 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           restore.sql                                                                                         0000600 0004000 0002000 00000051231 14513613455 0015375 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7
-- Dumped by pg_dump version 15.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE shopdb;
--
-- Name: shopdb; Type: DATABASE; Schema: -; Owner: bwilliam
--

CREATE DATABASE shopdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE shopdb OWNER TO bwilliam;

\connect shopdb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.account (
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


ALTER TABLE public.account OWNER TO bwilliam;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.brands (
    brand_id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_name character varying(255) NOT NULL,
    description text,
    origin_country character varying(100),
    website_url character varying(255)
);


ALTER TABLE public.brands OWNER TO bwilliam;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.categories (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(255) NOT NULL,
    parent_category_id uuid,
    description text
);


ALTER TABLE public.categories OWNER TO bwilliam;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.customers (
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state_province character varying(100),
    postal_code character varying(20),
    country character varying(100),
    registration_date date
);


ALTER TABLE public.customers OWNER TO bwilliam;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.order_items (
    order_item_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO bwilliam;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.orders (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    order_date timestamp without time zone NOT NULL,
    customer_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) NOT NULL,
    payment_method character varying(50)
);


ALTER TABLE public.orders OWNER TO bwilliam;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.product_variants (
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


ALTER TABLE public.product_variants OWNER TO bwilliam;

--
-- Name: products; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.products (
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


ALTER TABLE public.products OWNER TO bwilliam;

--
-- Name: shop_inventory; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.shop_inventory (
    inventory_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    product_id uuid NOT NULL,
    stock_quantity integer NOT NULL,
    min_stock_threshold integer NOT NULL,
    max_stock_threshold integer NOT NULL,
    last_restock_date date
);


ALTER TABLE public.shop_inventory OWNER TO bwilliam;

--
-- Name: shop_user_access; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.shop_user_access (
    access_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(20) NOT NULL,
    is_default boolean DEFAULT true,
    tenant_id uuid
);


ALTER TABLE public.shop_user_access OWNER TO bwilliam;

--
-- Name: shops; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.shops (
    shop_id uuid DEFAULT gen_random_uuid() NOT NULL,
    shop_name character varying(255) NOT NULL,
    tenant_id uuid NOT NULL,
    is_main_shop boolean NOT NULL,
    shop_description text,
    shop_address_line1 character varying(255),
    shop_address_line2 character varying(255),
    shop_city character varying(100),
    shop_state_province character varying(100),
    shop_postal_code character varying(20),
    shop_country character varying(100),
    shop_phone character varying(20),
    shop_email character varying(255),
    opening_hours character varying(255),
    website_url character varying(255),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.shops OWNER TO bwilliam;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.suppliers (
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
    registration_date date
);


ALTER TABLE public.suppliers OWNER TO bwilliam;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.tenants (
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
    url text
);


ALTER TABLE public.tenants OWNER TO bwilliam;

--
-- Name: units; Type: TABLE; Schema: public; Owner: bwilliam
--

CREATE TABLE public.units (
    unit_id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_name character varying(50) NOT NULL,
    abbreviation character varying(20),
    description text
);


ALTER TABLE public.units OWNER TO bwilliam;

--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.account (account_id, tenant_id, username, email, phone, first_name, last_name, is_verified, is_active, created_at, updated_at, role, password, deleted_at) FROM stdin;
\.
COPY public.account (account_id, tenant_id, username, email, phone, first_name, last_name, is_verified, is_active, created_at, updated_at, role, password, deleted_at) FROM '$$PATH$$/3694.dat';

--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.brands (brand_id, brand_name, description, origin_country, website_url) FROM stdin;
\.
COPY public.brands (brand_id, brand_name, description, origin_country, website_url) FROM '$$PATH$$/3691.dat';

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.categories (category_id, category_name, parent_category_id, description) FROM stdin;
\.
COPY public.categories (category_id, category_name, parent_category_id, description) FROM '$$PATH$$/3692.dat';

--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.customers (customer_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state_province, postal_code, country, registration_date) FROM stdin;
\.
COPY public.customers (customer_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state_province, postal_code, country, registration_date) FROM '$$PATH$$/3688.dat';

--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.order_items (order_item_id, order_id, product_id, quantity, unit_price, total_price) FROM stdin;
\.
COPY public.order_items (order_item_id, order_id, product_id, quantity, unit_price, total_price) FROM '$$PATH$$/3690.dat';

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.orders (order_id, shop_id, order_date, customer_id, total_amount, status, payment_method) FROM stdin;
\.
COPY public.orders (order_id, shop_id, order_date, customer_id, total_amount, status, payment_method) FROM '$$PATH$$/3689.dat';

--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.product_variants (variant_id, product_id, variant_name, price_adjustment, stock_quantity, weight, dimensions, color, size, is_available, date_added, date_modified) FROM stdin;
\.
COPY public.product_variants (variant_id, product_id, variant_name, price_adjustment, stock_quantity, weight, dimensions, color, size, is_available, date_added, date_modified) FROM '$$PATH$$/3686.dat';

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.products (product_id, product_name, description, price, stock_quantity, is_available, manufacturer, category, weight, dimensions, date_added, date_modified, image_url) FROM stdin;
\.
COPY public.products (product_id, product_name, description, price, stock_quantity, is_available, manufacturer, category, weight, dimensions, date_added, date_modified, image_url) FROM '$$PATH$$/3685.dat';

--
-- Data for Name: shop_inventory; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.shop_inventory (inventory_id, shop_id, product_id, stock_quantity, min_stock_threshold, max_stock_threshold, last_restock_date) FROM stdin;
\.
COPY public.shop_inventory (inventory_id, shop_id, product_id, stock_quantity, min_stock_threshold, max_stock_threshold, last_restock_date) FROM '$$PATH$$/3687.dat';

--
-- Data for Name: shop_user_access; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.shop_user_access (access_id, shop_id, user_id, role, is_default, tenant_id) FROM stdin;
\.
COPY public.shop_user_access (access_id, shop_id, user_id, role, is_default, tenant_id) FROM '$$PATH$$/3696.dat';

--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.shops (shop_id, shop_name, tenant_id, is_main_shop, shop_description, shop_address_line1, shop_address_line2, shop_city, shop_state_province, shop_postal_code, shop_country, shop_phone, shop_email, opening_hours, website_url, created_at) FROM stdin;
\.
COPY public.shops (shop_id, shop_name, tenant_id, is_main_shop, shop_description, shop_address_line1, shop_address_line2, shop_city, shop_state_province, shop_postal_code, shop_country, shop_phone, shop_email, opening_hours, website_url, created_at) FROM '$$PATH$$/3684.dat';

--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.suppliers (supplier_id, supplier_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date) FROM stdin;
\.
COPY public.suppliers (supplier_id, supplier_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date) FROM '$$PATH$$/3695.dat';

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.tenants (tenant_id, tenant_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date, subscription_type, subscription_expiry_date, is_active, url) FROM stdin;
\.
COPY public.tenants (tenant_id, tenant_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state_province, postal_code, country, website_url, registration_date, subscription_type, subscription_expiry_date, is_active, url) FROM '$$PATH$$/3683.dat';

--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: bwilliam
--

COPY public.units (unit_id, unit_name, abbreviation, description) FROM stdin;
\.
COPY public.units (unit_id, unit_name, abbreviation, description) FROM '$$PATH$$/3693.dat';

--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (variant_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: shop_inventory shop_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_pkey PRIMARY KEY (inventory_id);


--
-- Name: shop_user_access shop_user_access_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_pkey PRIMARY KEY (access_id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (shop_id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- Name: account uniqueuser; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT uniqueuser UNIQUE (username, email, phone);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (unit_id);


--
-- Name: categories categories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- Name: orders orders_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: shop_inventory shop_inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: shop_inventory shop_inventory_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_inventory
    ADD CONSTRAINT shop_inventory_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);


--
-- Name: shop_user_access shop_user_access_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(shop_id);


--
-- Name: shop_user_access shop_user_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shop_user_access
    ADD CONSTRAINT shop_user_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(account_id);


--
-- Name: shops shops_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


--
-- Name: account tenantkey; Type: FK CONSTRAINT; Schema: public; Owner: bwilliam
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT tenantkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(tenant_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       