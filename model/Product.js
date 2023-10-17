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


shopdb.ViewProduct = (tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT
           product.*,
           category.cat_name,
           supplier.supplier_name
FROM
              product product
              INNER JOIN category category ON product.cat_id  = category.cat_id
              INNER JOIN supplier supplier ON product.supplier_id  = supplier.supplier_id
              WHERE product.tenant_id = $1`, [tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.FindBySerial = (serial,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product WHERE serial = $1 AND tenant_id = $2`, [serial,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindById = (product_id,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product WHERE product_id = $1 AND tenant_id = $2`, [product_id,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = shopdb