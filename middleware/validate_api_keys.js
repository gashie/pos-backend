const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const { Finder } = require("../model/Global");

dotenv.config({ path: "./config/config.env" });
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");
exports.protectOutlet = asynHandler(async (req, res, next) => {
    let { client_id, client_keys } = req.headers


    if (!client_id || !client_keys) {
        CatchHistory({ api_response: `Failed to authenticate outlet,client did not provide keys and id`, function_name: 'protectOutlet-middleware', date_started: systemDate, sql_action: "", event: "Middleware to protect ecommerce outlet", actor: '' }, req)
        return sendResponse(res, 0, 401, 'Sorry, the system failed to verify this app')
    }
    //make sure apikey exists


    try {

        const tableName = 'outlet_api_keys';
        const columnsToSelect = []; // Use string values for column names
        const conditions = [
            { column: 'tenant_id', operator: '=', value: client_id },

        ];

        let results = await Finder(tableName, columnsToSelect, conditions)
        let ObjectExist = results.rows[0]
        if (!ObjectExist) {
            CatchHistory({ payload: JSON.stringify(req.body), api_response: `Failed to authenticate outlet,invalid client id or tenant`, function_name: 'verifyMainBeforeSwitch', date_started: systemDate, sql_action: "SELECT", event: "validate main shop before switching", actor: userData.id }, req)
            return sendResponse(res, 0, 200, `Sorry, the system failed to verify this app`)
        }

        const match = await bcrypt.compare(client_keys, ObjectExist.api_key)
        if (!match) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Failed to authenticate outlet,invalid client keys or apikeys`, function_name: 'verifyMainBeforeSwitch', date_started: systemDate, sql_action: "SELECT", event: "validate main shop before switching", actor: userData.id }, req)

          return sendResponse(res, 0, 401, 'Sorry, the system failed to verify this app')
        }

        req.client = ObjectExist;
      return next()

    } catch (error) {
        CatchHistory({ api_response: `Failed to authenticate outlet with the provided apikeys`, function_name: 'protectOutlet-middleware', date_started: systemDate, sql_action: "", event: "Middleware to protect ecommerce outlet", actor: '' }, req)
        return sendResponse(res, 0, 401, 'Sorry, the system failed to verify this app')
    }

});