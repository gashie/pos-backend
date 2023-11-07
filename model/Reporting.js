const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.IncomeAndExpenseCombined = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        
        WITH combined AS (
            SELECT
                EXTRACT(YEAR FROM transaction_date) AS year,
                EXTRACT(MONTH FROM transaction_date) AS month,
                SUM(amount) AS total_income,
                0 AS total_expenses
            FROM
                income
            WHERE tenant_id = $1
            GROUP BY
                year, month
            UNION ALL
            SELECT
                EXTRACT(YEAR FROM transaction_date) AS year,
                EXTRACT(MONTH FROM transaction_date) AS month,
                0 AS total_income,
                SUM(amount) AS total_expenses
            FROM
                expenses
            WHERE tenant_id = $1
            GROUP BY
                year, month
        )
        SELECT
            year,
            month,
            SUM(total_income) AS total_income,
            SUM(total_expenses) AS total_expenses,
            SUM(total_income) - SUM(total_expenses) AS net_profit
        FROM
            combined
        GROUP BY
            year, month
        ORDER BY
            year, month;
        
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.IncomeReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        
        SELECT
        EXTRACT(YEAR FROM transaction_date) AS year,
        EXTRACT(MONTH FROM transaction_date) AS month,
        SUM(amount) AS total_income
    FROM
        income
    WHERE tenant_id = $1
    GROUP BY
        year, month
    ORDER BY
        year, month;
    ;
        
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ExpenseReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        
        SELECT
        EXTRACT(YEAR FROM transaction_date) AS year,
        EXTRACT(MONTH FROM transaction_date) AS month,
        SUM(amount) AS total_income
    FROM
        income
    WHERE tenant_id = $1
    GROUP BY
        year, month
    ORDER BY
        year, month;
    ;
        
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ProductListReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        
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
        oi.product_id = p.product_id
        WHERE oi.tenant_id = $1
    `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ProductSummariesReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
            COUNT(DISTINCT oi.product_id) AS unique_product_count,
            (SELECT COUNT(*) FROM product) AS total_product_count,
            (SELECT SUM(prod_price) FROM product) AS total_retail_value,
            (SELECT SUM(wholesale_price) FROM product) AS total_wholesale_value,
            (SELECT SUM(cos_price) FROM product) AS total_inventory_cost
        FROM
            outlet_inventory AS oi
        
        WHERE oi.tenant_id = $1
    `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ProductOutletInventoryProfitReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
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
    
        
        WHERE oi.tenant_id = $1
    `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.CustomersOnCreditByDate = (start, end, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
	ch.total_amount_due AS total_cost,
	ch.total_amount_paid AS paid_amount,
    ch.total_amount_remaining AS remaining_amount,
	ch.order_id
FROM
    customers AS c
INNER JOIN
    credit_history AS ch
ON
    c.customer_id = ch.customer_id
    WHERE
        ch.complete_credit = false
    AND ch.transaction_date >= $1 AND ch.transaction_date < $2 AND ch.tenant_id = $3
GROUP BY
    c.customer_id, customer_name,total_cost,paid_amount, ch.total_amount_remaining,ch.order_id
ORDER BY
    ch.total_amount_remaining DESC;
        `, [start, end, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.CategorySalesReport = (start, end, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
        c.category_name,
        CASE
            WHEN o.status = 'pending' THEN 'Pending'
            WHEN o.status = 'complete' THEN 'Complete'
        END AS status,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.quantity * oi.unit_price) AS total_sales,
        SUM(oi.quantity * (oi.unit_price - p.cos_price)) AS total_profit
    FROM
        order_items AS oi
    JOIN
        product AS p
    ON
        oi.product_id = p.product_id
    JOIN
        categories AS c
    ON
        p.cat_id = c.category_id
    JOIN
        orders AS o
    ON
        oi.order_id = o.order_id
    WHERE
    o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3
    GROUP BY
        c.category_name, status
    ORDER BY
        c.category_name, status;
        `, [start, end, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.SalesProfitCharges = (start, end, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        

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
o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3
GROUP BY
year, month
ORDER BY
year, month;
        `, [start, end, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.EmployeePerformanceReport = (start, end, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
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
    WHERE
o.order_date >= $1 AND o.order_date < $2 AND o.tenant_id = $3
GROUP BY
    a.account_id, a.first_name, a.last_name
ORDER BY
    total_sales DESC;
        `, [start, end, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.ProfitMarginsReport = (start, end, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
    p.product_id,
    p.prod_name AS product_name,
    p.cos_price AS cost_price,
    p.prod_price AS retail_price,
    p.wholesale_price,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * oi.unit_price) AS total_sales,
    SUM(oi.quantity * (oi.unit_price - p.cos_price)) AS total_profit
FROM
    product AS p
LEFT JOIN
    order_items AS oi
ON
    p.product_id = oi.product_id
    WHERE
oi.order_date >= $1 AND oi.order_date < $2 AND oi.tenant_id = $3
GROUP BY
    p.product_id, p.prod_name, p.cos_price, p.prod_price, p.wholesale_price
ORDER BY
    p.product_id;
        `, [start, end, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.OverheadExpenseReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
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
    WHERE e.tenant_id = $1
GROUP BY
    ec.category_id, ec.category_name
ORDER BY
    ec.category_id;
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.CheckReorderReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`

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
            WHERE oi.tenant_id = $1
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
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.CheckReorderByOutletReport = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`

        WITH ProductStock AS (
            SELECT
                oi.product_id,
                p.prod_name,
                oi.outlet_id,
                ot.outlet_name, 
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
            LEFT JOIN
                outlet AS ot
            ON
                oi.outlet_id = ot.outlet_id
            WHERE oi.tenant_id = $1
            GROUP BY
                oi.product_id, p.prod_name, oi.outlet_id, ot.outlet_name, oi.min_stock_threshold, oi.max_stock_threshold
        )
        SELECT
            outlet_id,
            outlet_name,  
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
        
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};



module.exports = shopdb