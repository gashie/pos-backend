const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.checkExist = (field,value,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT product_option_id FROM product_option_values WHERE ${field} = $1 AND tenant_id = $2`, [value,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.Find = (product_option_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product_option_values WHERE product_option_id = $1`, [product_option_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindByIdWithTenant = (product_option_id,tenant_id,product_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product_option_values WHERE product_option_id = $1 AND tenant_id = $2 AND product_id = $3`, [product_option_id,tenant_id,product_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.FindbyId = (product_option_value_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product_option_values WHERE product_option_value_id = $1`, [product_option_value_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = shopdb