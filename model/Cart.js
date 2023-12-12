const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.deleteItemFromCart = (product_id,customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM shopping_cart WHERE product_id = $1  AND customer_id = $2", [product_id,customer_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.ViewMyCart = (customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.prod_name,
        p.prod_price,
        p.prod_qty,
        cart.*
FROM product p
INNER JOIN shopping_cart cart ON p.product_id = cart.product_id
WHERE cart.customer_id = $1 AND cart.cart_status = $2
        
        `, [customer_id,'status'], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb