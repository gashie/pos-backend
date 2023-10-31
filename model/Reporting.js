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



module.exports = shopdb