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

shopdb.ViewMyWishlist = (outlet_id,customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT
    oi.product_id,
    p.prod_name,
    p.prod_price,
    w.wishlist_id,  -- Add fields from the wishlist table
    w.wishlist_status
    -- Add other product and wishlist fields as needed
FROM
    outlet_inventory oi
JOIN
    product p ON oi.product_id = p.product_id
JOIN
    wishlist w ON p.product_id = w.product_id
WHERE
    oi.outlet_id = $1
    AND w.customer_id = $2
    AND wishlist.wishlist_status = $3
        
        `, [outlet_id,customer_id,'liked'], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb