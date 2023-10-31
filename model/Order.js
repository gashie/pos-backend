const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.FetchOrderByDate = (start, end,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
        p.product_id,
        p.prod_name,
        p.prod_pic,
        p.prod_qty,
        CONCAT  (cu.first_name, ' ', cu.last_name) AS "customer",
        oi.quantity,
        oi.unit_price,
        o.order_reference,
        o.status,
        o.payment_method,
        o.order_id,
        o.outlet_id,
        o.transaction_from,
        o.notes,
        CONCAT  (ac.first_name, ' ', ac.last_name) AS "processed_by"
        
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
    INNER JOIN
        customers AS cu
    ON
        o.customer_id = cu.customer_id
    INNER JOIN
        account AS ac
    ON
        ac.account_id = o.processed_by
    WHERE o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3 ORDER BY o.order_date DESC
        `, [start, end,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FetchCreditOrderByDate = (start, end,tenant_id,complete_credit) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
        c.customer_id,
        CONCAT  (c.first_name, ' ', c.last_name) AS "customer",
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
     WHERE o.order_date >= $1 AND o.order_date  < $2 AND o.tenant_id = $3 AND ch.complete_credit = $4
    GROUP BY
        c.customer_id,
        CONCAT  (c.first_name, ' ', c.last_name),
        c.email,
        c.phone_number,
        ch.total_amount_paid,
        ch.total_amount_remaining,
        p.prod_name,
        ch.total_amount_due,
        outlet.outlet_name,
         CONCAT  (ac.first_name, ' ', ac.last_name),
        ch.outlet_id;
    
        `, [start, end,tenant_id,complete_credit], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FetchOrderCardsByDate = (start, end,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
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
    WHERE o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3;
    
        `, [start, end,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FetchCreditOrderCardsByDate = (start, end,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
        COUNT(DISTINCT o.order_id) AS order_count,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.order_id END) AS order_count_pending,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.customer_id END) AS customers_on_credit,
        COUNT(DISTINCT o.customer_id) AS customer_count,
        SUM(oi.quantity) AS total_quantity_ordered,
        SUM(CASE WHEN o.status = 'pending' THEN oi.quantity ELSE 0 END) AS quantity_sold_on_credit,
        SUM(oi.quantity * oi.unit_price) AS total_sales,
        SUM(o.discount_fee) AS total_discount,
        SUM(oi.quantity * oi.unit_price - o.discount_fee) AS total_amount,
        SUM(CASE WHEN o.status = 'pending' THEN oi.quantity * oi.unit_price ELSE 0 END) AS total_credit
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
    WHERE o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3;
    
        `, [start, end,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.OrderTkeOut = (qty,product_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE outlet_inventory SET stock_quantity = stock_quantity - $1 WHERE product_id = $2`, [qty,product_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.OutletOrderTkeOut = (qty,product_id,outlet_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE outlet_inventory SET stock_quantity = stock_quantity - $1 WHERE product_id = $2 AND outlet_id = $3`, [qty,product_id,outlet_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb