const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.FetchTransferData = (start,end,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        transfer.transfer_id,
        transfer.source_outlet_id,
        transfer.transfer_from,
        source_outlet.outlet_name AS source_outlet_name,
        transfer.destination_outlet_id,
        destination_outlet.outlet_name AS destination_outlet_name,
        transfer.transfer_date,
        transfer.notes,
        transfer.is_acknowledged,
        transfer.accept_status,
        transfer.ref_code,
        transfer.reference,
        transfer.processed_by,
        CONCAT  (ac.first_name, ' ', ac.last_name) AS "processed_by_full_name"
    FROM
        transfer_stock transfer
    INNER JOIN
        outlet source_outlet ON source_outlet.outlet_id = transfer.source_outlet_id
    INNER JOIN
        outlet destination_outlet ON destination_outlet.outlet_id = transfer.destination_outlet_id
        INNER JOIN
        account AS ac
    ON
        ac.account_id = transfer.processed_by
        WHERE  transfer.transfer_date >= $1 AND  transfer.transfer_date < $2 AND transfer.tenant_id = $3 ORDER BY  transfer.transfer_date DESC
        `, [start,end,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.FindTransferData = (transfer_id,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT 
        transfer.transfer_id,
        transfer.source_outlet_id,
        source_outlet.outlet_name AS source_outlet_name,
        transfer.destination_outlet_id,
        destination_outlet.outlet_name AS destination_outlet_name,
        transfer.transfer_date,
        transfer.notes,
        transfer.is_acknowledged,
        transfer.ref_code,
        transfer.reference,
        transfer.processed_by,
        CONCAT  (ac.first_name, ' ', ac.last_name) AS "processed_by_full_name"
    FROM
        transfer_stock transfer
    INNER JOIN
        outlet source_outlet ON source_outlet.outlet_id = transfer.source_outlet_id
    INNER JOIN
        outlet destination_outlet ON destination_outlet.outlet_id = transfer.destination_outlet_id
        INNER JOIN
        account AS ac
    ON
        ac.account_id = transfer.processed_by
        WHERE  transfer.transfer_id = $1  AND transfer.tenant_id = $2
        `, [transfer_id,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};


shopdb.deleteTransfer = (transfer_id,tenant_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM transfer_stock WHERE transfer_id = $1  AND tenant_id = $2", [transfer_id,tenant_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.TransferTakeOut = (qty, product_id,outlet_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE outlet_inventory SET stock_quantity = stock_quantity + $1 WHERE product_id = $2 AND outlet_id = $3`, [qty, product_id,outlet_id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
module.exports = shopdb