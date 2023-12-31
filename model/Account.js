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
shopdb.CustomerAuth = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(

            `SELECT *
            FROM customers
            WHERE username = $1 OR email = $1
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

shopdb.deleteItemFromRolePermission = (role_id, permission_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        DELETE FROM role_permissions 
WHERE role_id = $1 AND permission_id = $2;

        `, [role_id, permission_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ShowRolePermissions = () => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
    r.role_name,
    p.permission_name 
FROM 
    roles r
    INNER JOIN role_permissions rp ON r.role_id = rp.role_id
    INNER JOIN permissions p ON rp.permission_id = p.permission_id
ORDER BY 
    r.role_name, p.permission_name;

        `, [], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ShowUserRoles = () => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        u.account_id,
        r.role_id,
        CONCAT  (u.first_name, ' ', u.last_name) AS "full_name",
            u.username,
            r.role_name
        FROM 
            account u
            INNER JOIN user_roles ur ON u.account_id = ur.user_id
            INNER JOIN roles r ON ur.role_id = r.role_id
        ORDER BY 
            u.username, r.role_name;

        `, [], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.deleteItemFromUserRoles = (user_id, role_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        DELETE FROM user_roles 
WHERE user_id = $1 AND role_id = $2;

        `, [user_id, role_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb