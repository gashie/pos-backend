const pool = require("../config/db");
const { logger } = require("../logs/winston");

let shopdb = {};

const ViewLocationCascaded = async (parent_location_id) => {
    try {
        let query;
        let params;

        if (parent_location_id) {
            query = "SELECT * FROM location WHERE parent_location_id = $1";
            params = [parent_location_id];
        } else {
            query = "SELECT * FROM location WHERE parent_location_id IS NULL";
            params = [];
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return [];
        }

        const locations = [];

        for (const location of result.rows) {
            const children = await ViewLocationCascaded(location.location_id);
            locations.push({ ...location, children });
        }

        return locations;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

shopdb.ViewLocationCascaded = ViewLocationCascaded;


module.exports = shopdb