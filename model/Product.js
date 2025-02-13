const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.checkExist = (field, value, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT product_id FROM product WHERE ${field} = $1 AND tenant_id = $2`, [value, tenant_id], (err, results) => {
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

shopdb.FindBySerial = (serial, tenant_id, outlet_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.*,
        oi.stock_quantity
FROM product p
INNER JOIN outlet_inventory oi ON p.product_id = oi.product_id
WHERE p.serial = $1 AND oi.tenant_id = $2 AND oi.outlet_id = $3
        
        `, [serial, tenant_id, outlet_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindById = (product_id, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM product WHERE product_id = $1 AND tenant_id = $2`, [product_id, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindOutletProductById = (product_id, tenant_id, outlet_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.*,
        oi.stock_quantity
FROM product p
INNER JOIN outlet_inventory oi ON p.product_id = oi.product_id
WHERE oi.product_id = $1 AND oi.tenant_id = $2 AND oi.outlet_id = $3;
        `, [product_id, tenant_id, outlet_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindWareHouseProductById = (product_id, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        *
FROM product
WHERE product_id = $1 AND tenant_id = $2;
        `, [product_id, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindOutletProductByOutletId = (outlet_id, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.*,
        oi.stock_quantity
FROM product p
INNER JOIN outlet_inventory oi ON p.product_id = oi.product_id
WHERE oi.outlet_id = $1 AND p.tenant_id = $2;
        `, [outlet_id, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindOnlyOutletProductByOutletId = (outlet_id, tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        p.*,
        oi.stock_quantity
FROM product p
INNER JOIN outlet_inventory oi ON p.product_id = oi.product_id
WHERE oi.outlet_id = $1 AND p.tenant_id = $2 AND oi.stock_quantity > 0;
        `, [outlet_id, tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindItemsToPick = (transfer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT p.*,
        CONCAT  (ac.first_name, ' ', ac.last_name) AS "picked_up_by_full_name"
        FROM consignment AS c
        INNER JOIN product AS p ON c.product_id = p.product_id
        INNER JOIN
                account AS ac
            ON
                ac.account_id = c.picked_up_by
        WHERE c.transfer_id = $1;
        
        `, [transfer_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.ProductTakeOut = (qty, product_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE product SET prod_qty = prod_qty - $1 WHERE product_id = $2`, [qty, product_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = shopdb