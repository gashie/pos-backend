const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateBank = asynHandler(async (req, res, next) => {
    //check if bank exist
    let userData = req.user;
    let payload = req.body;
    let results = await GlobalModel.Create(payload, 'banks','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New bank added`, function_name: 'CreateBank', date_started: systemDate, sql_action: "INSERT", event: "Create Bank", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateBank', date_started: systemDate, sql_action: "INSERT", event: "Create Bank", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewBanks = asynHandler(async (req, res, next) => {
    let userData = req.user;
 
    const tableName = 'banks';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewBanks', date_started: systemDate, sql_action: "SELECT", event: "View list of banks", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} bank record`, function_name: 'ViewBanks', date_started: systemDate, sql_action: "SELECT", event: "View list of banks", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateBank = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'banks', 'bank_id', payload.bank_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated bank details`, function_name: 'UpdateBank', date_started: systemDate, sql_action: "UPDATE", event: "Update bank details", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated bank details`, function_name: 'UpdateBank', date_started: systemDate, sql_action: "UPDATE", event: "Update bank details", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})