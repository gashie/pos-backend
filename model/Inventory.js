const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.FetchInventory = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        prod.product_id ,
        prod.prod_name,
        prod.prod_qty,
        invet.qty AS stock,
        invet.old_qty AS oldStock,
        invet.created_at
FROM
                inventory invet
                INNER JOIN product prod ON prod.product_id  = invet.product_id
                WHERE invet.tenant_id = $1
        `, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.FetchInventoryHistory = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT * FROM public.inventory
        WHERE tenant_id = $1
        ORDER BY created_at DESC 
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