const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.checkExist = (cat_name,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT cat_name FROM category WHERE cat_name = $1 AND tenant_id = $2", [cat_name,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};


module.exports = shopdb