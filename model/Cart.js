const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.deleteItemFromCart = (product_id, customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM shopping_cart WHERE product_id = $1  AND customer_id = $2", [product_id, customer_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.ViewMyCart = (outlet_id,customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
    oi.product_id,
    p.prod_name,
    p.prod_price,
	sc.cart_id,
    sc.quantity, 
    sc.cart_status
FROM
    outlet_inventory oi
JOIN
    product p ON oi.product_id = p.product_id
JOIN
    shopping_cart sc ON p.product_id = sc.product_id
WHERE
    oi.outlet_id = $1
    AND sc.customer_id = $2; 
    AND sc.cart_status = $3`,
            [outlet_id,customer_id, 'loaded'], (err, results) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                return resolve(results);
            });
    });
};
module.exports = shopdb