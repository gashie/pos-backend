const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.deleteItemFromWishList = (product_id,customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM wishlist WHERE product_id = $1  AND customer_id = $2", [product_id,customer_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.ViewMyWishlist = (customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.prod_name,
        p.prod_price,
        oi.stock_quantity,
        wishlist.*
FROM product p
INNER JOIN wishlist wishlist ON p.product_id = wishlist.product_id
INNER JOIN outlet_inventory oi ON wishlist.product_id = oi.product_id
WHERE wishlist.customer_id = $1 AND wishlist.wishlist_status = $2
        
        `, [customer_id,'liked'], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb