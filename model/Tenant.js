const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

shopdb.ValidateDynamicValue = (variable,value) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT ${variable} FROM tenants WHERE ${variable} = $1`,[value], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

shopdb.Find = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM main_fee WHERE name = $1", [id], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.FindPercentFee = (name) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT percentage_fee FROM main_fee WHERE name = $1", [name], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};
shopdb.Create = (payload) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO main_fee (id, created_at, name, flat_fee, percentage_fee, maximum_amount, notes, apply_fee) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [
            payload.id,
            payload.created_at,
            payload.name,
            payload.flat_fee,
            payload.percentage_fee,
            payload.maximum_amount,
            payload.notes,
            payload.apply_fee,

        ], (err, results) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                return resolve(results);
            });
    });
};

shopdb.Update = (percentage_fee,updated_at,id) => {
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

module.exports = shopdb