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
           category.category_name,
           supplier.supplier_name,
           brand.brand_name,
           item_unit.unit_type

FROM
              product product
              INNER JOIN categories category ON product.cat_id  = category.category_id
              INNER JOIN suppliers supplier ON product.supplier_id  = supplier.supplier_id
              INNER JOIN brands brand ON product.brand_id  = brand.brand_id
              INNER JOIN item_unit item_unit ON product.unit_id  = item_unit.unit_id
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