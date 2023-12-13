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

shopdb.ViewMyCart = (customer_id,outlet_id, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.prod_name,
        p.prod_price,
        oi.stock_quantity,
        cart.*
FROM product p
INNER JOIN shopping_cart cart ON p.product_id = cart.product_id
INNER JOIN outlet_inventory oi ON cart.product_id = oi.product_id
WHERE cart.customer_id = $1 AND cart.cart_status = $2 AND oi.outlet_id = $3 AND p.tenant_id = $4`,
[customer_id,'loaded',outlet_id, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb