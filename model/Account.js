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

shopdb.ShowTenantUsers = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        account_id, 
        tenant_id, 
        username, 
        email, 
        phone, 
        first_name, 
        last_name, 
        is_verified, 
        is_active, 
        created_at, 
        updated_at, 
        role,
        deleted_at
        FROM account WHERE tenant_id = $1`, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = shopdb