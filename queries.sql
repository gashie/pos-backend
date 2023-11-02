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
