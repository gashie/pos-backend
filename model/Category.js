const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.checkExist = (category_name,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT category_name FROM category WHERE category_name = $1 AND tenant_id = $2", [category_name,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};


module.exports = shopdb