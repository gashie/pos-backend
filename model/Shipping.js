const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};



shopdb.ViewShippingCarriers = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        sc.*,
    CONCAT  (a.first_name, ' ', a.last_name) AS "created_by_full_name"
FROM shipping_carrier sc
INNER JOIN account a ON sc.created_by = a.account_id
WHERE sc.tenant_id = $1
        
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