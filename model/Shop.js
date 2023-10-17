const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.reSetMain = (percentage_fee,updated_at,id) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE  main_fee SET percentage_fee = $1, updated_at = $2 WHERE id = $3", [percentage_fee,updated_at,id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindDefaultShop = (user) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT shop_id,role FROM shop_user_access WHERE user_id = $1 AND is_default = $2", [user,true], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};


module.exports = shopdb