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
This modified query will provide the unique product count in outlet_inventory, total product count, total retail value, and total wholesale value, considering only records with tenant_id equal to 1.
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


//old sales query
     SELECT
        COUNT(DISTINCT o.order_id) AS order_count,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.order_id END) AS order_count_pending,
        COUNT(DISTINCT CASE WHEN o.status = 'complete' THEN o.order_id END) AS order_count_complete,
        COUNT(DISTINCT CASE WHEN o.status = 'complete' THEN o.customer_id END) AS customers_paid,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.customer_id END) AS customers_on_credit,
        COUNT(DISTINCT o.customer_id) AS customer_count,
        SUM(oi.quantity) AS total_quantity_ordered,
        SUM(CASE WHEN o.status = 'complete' THEN oi.quantity ELSE 0 END) AS quantity_sold,
        SUM(CASE WHEN o.status = 'pending' THEN oi.quantity ELSE 0 END) AS quantity_sold_on_credit,
        SUM(oi.quantity * oi.unit_price) AS total_sales,
        SUM(o.discount_fee) AS total_discount,
        SUM(oi.quantity * oi.unit_price - o.discount_fee) AS total_amount,
        SUM(CASE WHEN o.status = 'pending' THEN oi.quantity * oi.unit_price ELSE 0 END) AS total_credit,
        SUM(CASE WHEN o.status = 'complete' THEN oi.quantity * oi.unit_price - o.discount_fee ELSE 0 END) AS total_payment
    FROM
        orders AS o
    INNER JOIN
        order_items AS oi
    ON
        o.order_id = oi.order_id
    INNER JOIN
        product AS p
    ON
        oi.product_id = p.product_id

//new sales query with profit
This query will give you the profit for both 'complete' and 'pending' orders. It calculates the profit for each case based on the difference between the unit price and the cost price, taking discounts into account.
SELECT
    COUNT(DISTINCT o.order_id) AS order_count,
    COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.order_id END) AS order_count_pending,
    COUNT(DISTINCT CASE WHEN o.status = 'complete' THEN o.order_id END) AS order_count_complete,
    COUNT(DISTINCT CASE WHEN o.status = 'complete' THEN o.customer_id END) AS customers_paid,
    COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.customer_id END) AS customers_on_credit,
    COUNT(DISTINCT o.customer_id) AS customer_count,
    SUM(oi.quantity) AS total_quantity_ordered,
    SUM(CASE WHEN o.status = 'complete' THEN oi.quantity ELSE 0 END) AS quantity_sold,
    SUM(CASE WHEN o.status = 'pending' THEN oi.quantity ELSE 0 END) AS quantity_sold_on_credit,
    SUM(oi.quantity * oi.unit_price) AS total_sales,
    SUM(o.discount_fee) AS total_discount,
    SUM(oi.quantity * oi.unit_price - o.discount_fee) AS total_amount,
    SUM(CASE WHEN o.status = 'pending' THEN oi.quantity * oi.unit_price ELSE 0 END) AS total_credit,
    SUM(CASE WHEN o.status = 'complete' THEN oi.quantity * oi.unit_price - o.discount_fee ELSE 0 END) AS total_payment,
    SUM(CASE WHEN o.status = 'complete' THEN oi.quantity * (oi.unit_price - p.cos_price) ELSE 0 END) AS sales_profit,
    SUM(CASE WHEN o.status = 'pending' THEN oi.quantity * (oi.unit_price - p.cos_price) ELSE 0 END) AS profit_on_credit
FROM
    orders AS o
INNER JOIN
    order_items AS oi
ON
    o.order_id = oi.order_id
INNER JOIN
    product AS p
ON
    oi.product_id = p.product_id


//outlet performance ,a query to display each outlet profit and credit

This query will display the outlet name from the outlet table and calculate the profit and total credit as previously explained, ordered by profit and total credit in descending order.
SELECT
    o.outlet_id,
    ot.outlet_name,
    SUM(CASE WHEN o.status = 'complete' THEN oi.quantity * (oi.unit_price - p.cos_price) ELSE 0 END) AS profit,
    SUM(CASE WHEN o.status = 'pending' THEN oi.quantity * oi.unit_price ELSE 0 END) AS total_credit
FROM
    orders AS o
INNER JOIN
    outlet AS ot
ON
    o.outlet_id = ot.outlet_id
INNER JOIN
    order_items AS oi
ON
    o.order_id = oi.order_id
INNER JOIN
    product AS p
ON
    oi.product_id = p.product_id
GROUP BY
    o.outlet_id, ot.outlet_name
ORDER BY
    profit DESC, total_credit DESC;


//outlet inventory wholesale and retail profit
This query retrieves product information from outlet_inventory and calculates the profit using the cost price (cos_price) from the product table. It shows the retail profit and wholesale profit for each product.
SELECT
    o.product_id,
    p.prod_name AS product_name,
    o.quantity AS stock_quantity,
    o.selling_price - p.cos_price AS retail_profit,
    o.wholesale_price - p.cos_price AS wholesale_profit
FROM
    outlet_inventory AS o
INNER JOIN
    product AS p
ON
    o.product_id = p.product_id;

//list all customers who are on credit
This query joins the customers table with the credit_history table based on the customer_id and selects customers with complete_credit as false. It groups the results by customer and orders them by total_amount_remaining in descending order, showing customers on credit with the highest remaining amounts.

SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    ch.total_amount_remaining
FROM
    customers AS c
INNER JOIN
    credit_history AS ch
ON
    c.customer_id = ch.customer_id
WHERE
    ch.complete_credit = false
GROUP BY
    c.customer_id, customer_name, ch.total_amount_remaining
ORDER BY
    ch.total_amount_remaining DESC;

//report by category



//sales and profit and charges



SELECT
    EXTRACT(YEAR FROM o.order_date) AS year,
    EXTRACT(MONTH FROM o.order_date) AS month,
    SUM(oi.quantity * oi.unit_price) AS total_sales,
	SUM(o.charge_Amount) AS total_charges,
    SUM(oi.quantity * (oi.unit_price - p.cos_price)) AS total_profit
FROM
    orders AS o
JOIN
    order_items AS oi
ON
    o.order_id = oi.order_id
JOIN
    product AS p
ON
    oi.product_id = p.product_id
WHERE
     o.order_date >= '2023-10-30' AND o.order_date <= '2023-11-06'
GROUP BY
    year, month
ORDER BY
    year, month;


// employers performance
SELECT
    a.account_id AS employee_id,
    a.first_name AS employee_first_name,
    a.last_name AS employee_last_name,
    COUNT(o.order_id) AS total_orders,
    SUM(oi.quantity * oi.unit_price) AS total_sales
FROM
    account AS a
LEFT JOIN
    orders AS o
ON
    a.account_id = o.processed_by
LEFT JOIN
    order_items AS oi
ON
    o.order_id = oi.order_id
GROUP BY
    a.account_id, a.first_name, a.last_name
ORDER BY
    total_sales DESC;


// Profit margins 

SELECT
    ec.expense_category_id,
    ec.expense_category_name,
    SUM(e.amount) AS total_expense_amount
FROM
    expenses AS e
LEFT JOIN
    expenses_category AS ec
ON
    e.expense_category_id = ec.expense_category_id
GROUP BY
    ec.expense_category_id, ec.expense_category_name
ORDER BY
    ec.expense_category_id;

//Expenses, including overhead costs:
SELECT
    ec.category_id,
    ec.category_name,
    SUM(e.amount) AS total_expense_amount
FROM
    expenses AS e
LEFT JOIN
    expense_category AS ec
ON
    e.expense_category = ec.category_id
GROUP BY
    ec.category_id, ec.category_name
ORDER BY
    ec.category_id;


//reordering based on their stock levels

WITH ProductStock AS (
    SELECT
        oi.product_id,
        p.prod_name,
        oi.min_stock_threshold,
        oi.max_stock_threshold,
        SUM(oi.stock_quantity) AS total_quantity_sold,
        MAX(oi.stock_quantity) AS current_stock
    FROM
        outlet_inventory AS oi
    LEFT JOIN
        product AS p
    ON
        oi.product_id = p.product_id
    LEFT JOIN
        orders AS o
    ON
        oi.outlet_id = o.outlet_id
        AND oi.product_id = p.product_id
        AND o.status = 'complete'
    GROUP BY
        oi.product_id, p.prod_name, oi.min_stock_threshold, oi.max_stock_threshold
)
SELECT
    product_id,
    prod_name,
    min_stock_threshold,
    max_stock_threshold,
    current_stock,
    total_quantity_sold,
    CASE
        WHEN current_stock < min_stock_threshold THEN 'Reorder Required'
        WHEN current_stock >= min_stock_threshold AND current_stock <= max_stock_threshold THEN 'Stock Level OK'
        ELSE 'Overstocked'
    END AS stock_status
FROM
    ProductStock;
