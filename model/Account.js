const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.ValidateDynamicValue = (variable, value) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT ${variable} FROM account WHERE ${variable} = $1`, [value], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.auth = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(

            `
            SELECT DISTINCT
			userinfo.account_id AS user_id,
            userinfo.*,
			tenant.*
    FROM
                  account userinfo
                  INNER JOIN tenants tenant ON userinfo.tenant_id  = tenant.tenant_id
                  WHERE userinfo.username = $1
            `

            , [username], (err, results) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                return resolve(results);
            });
    });
};

module.exports = shopdb