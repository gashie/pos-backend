//view credit_history
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS "customer",
    c.email,
    c.phone_number AS phone,
    ch.order_id,
    ch.total_amount_paid,
    ch.total_amount_remaining,
    ch.total_amount_due,
    o.outlet_id,
    outlet.outlet_name,
    CONCAT(ac.first_name, ' ', ac.last_name) AS "processed_by_full_name"
FROM
    credit_history AS ch
LEFT JOIN customers AS c ON ch.customer_id = c.customer_id
LEFT JOIN orders AS o ON ch.order_id = o.order_id
LEFT JOIN outlet AS outlet ON o.outlet_id = outlet.outlet_id
LEFT JOIN account AS ac ON o.processed_by = ac.account_id
WHERE ch.complete_credit = false

//income year on year

SELECT
    EXTRACT(YEAR FROM transaction_date) AS year,
    EXTRACT(MONTH FROM transaction_date) AS month,
    SUM(amount) AS total_income
FROM
    income
GROUP BY
    year, month
ORDER BY
    year, month;

//expenses monthly
SELECT
    EXTRACT(YEAR FROM transaction_date) AS year,
    EXTRACT(MONTH FROM transaction_date) AS month,
    SUM(amount) AS total_expenses
FROM
    expenses
GROUP BY
    year, month
ORDER BY
    year, month;


//inventory count
-- Unique product count in all outlet_inventory
SELECT
    COUNT(DISTINCT oi.product_id) AS unique_product_count,
    -- Count of all products
    (SELECT COUNT(*) FROM product) AS total_product_count,
    -- Total retail value for all products
    (SELECT SUM(prod_price) FROM product) AS total_retail_value,
    -- Total wholesale value for all products
    (SELECT SUM(wholesale_price) FROM product) AS total_wholesale_value,
    -- Total inventory cost using cos_price in product table
    (SELECT SUM(cos_price) FROM product) AS total_inventory_cost
FROM
    outlet_inventory AS oi;

//inventory list

SELECT
    o.outlet_id,
    o.outlet_name,
    p.product_id,
    p.prod_name,
    oi.stock_quantity
FROM
    outlet AS o
LEFT JOIN
    outlet_inventory AS oi
ON
    o.outlet_id = oi.outlet_id
LEFT JOIN
    product AS p
ON
    oi.product_id = p.product_id;
