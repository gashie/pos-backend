const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.checkExist = (field,value,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT product_id FROM product WHERE ${field} = $1 AND tenant_id = $2`, [value,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.FindByProductId = (product_id,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product_options WHERE product_id = $1 AND tenant_id = $2 ORDER BY option_order`, [product_id,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = shopdb