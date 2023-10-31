//view credit_history
SELECT
    c.customer_id,
    c.first_name AS customer_name,
    c.email,
    c.phone_number AS phone,
    ch.total_amount_paid,
    ch.total_amount_remaining,
    p.prod_name AS product_name,
	ch.total_amount_due As prod_price,
	outlet.outlet_name,
	 CONCAT  (ac.first_name, ' ', ac.last_name) AS "processed_by_full_name",
	ch.outlet_id
FROM
    customers AS c
LEFT JOIN
    (
        SELECT DISTINCT customer_id
        FROM orders
    ) AS distinct_customers
ON
    c.customer_id = distinct_customers.customer_id
LEFT JOIN
    credit_history AS ch
ON
    c.customer_id = ch.customer_id
LEFT JOIN
    orders AS o
ON
    c.customer_id = o.customer_id
LEFT JOIN
    order_items AS oi
ON
    o.order_id = oi.order_id
LEFT JOIN
    outlet_inventory AS oi2
ON
    oi.product_id = oi2.product_id
LEFT JOIN
    product AS p
ON
    oi2.product_id = p.product_id
LEFT JOIN
    outlet AS outlet
ON
    oi.outlet_id = outlet.outlet_id
LEFT JOIN
    account AS ac
ON
    oi.processed_by = ac.account_id

GROUP BY
    c.customer_id,
    c.first_name,
    c.email,
    c.phone_number,
    ch.total_amount_paid,
    ch.total_amount_remaining,
    p.prod_name,
	ch.total_amount_due,
	outlet.outlet_name,
	 CONCAT  (ac.first_name, ' ', ac.last_name),
	ch.outlet_id;
