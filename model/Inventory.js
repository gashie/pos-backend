const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.FetchInventory = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        prod.product_id ,
        prod.prod_name,
       
        optval.option_value_name,
        prod.prod_qty,
        option_value_qty,
        invet.qty AS stock,
        invet.created_at
FROM
                inventory invet
                INNER JOIN product prod ON prod.product_id  = invet.product_id
                INNER JOIN product_option_values optval ON invet.product_id  = optval.product_id
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



module.exports = shopdb