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

shopdb.FetchAssignedUserGroupBands = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT DISTINCT
            usergroup.user_group_band_id,
            CONCAT  (account.first_name, ' ', account.last_name) AS "employee",
			usergroup.user_group_band_id,
			groupband.group_band_name,
			groupband.band_basic_salary

    FROM
                  user_group_band usergroup
                  INNER JOIN group_band groupband ON usergroup.group_band_id  = groupband.group_band_id
				  INNER JOIN account account ON account.account_id  = usergroup.employee_id
				  WHERE groupband.tenant_id  = $1
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