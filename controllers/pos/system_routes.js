const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateSystemRoutes = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.created_by = userData?.id
    let results = await GlobalModel.Create(payload, 'routes','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New system routes added`, function_name: 'CreateSystemRoutes', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM ROUTE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSystemRoutes', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM ROUTE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewSystemRoutes = asynHandler(async (req, res, next) => {
    let userData = req.user;
  
    const tableName = 'routes';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewSystemRoutes', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM ROUTE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} system routes record's`, function_name: 'ViewSystemRoutes', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM ROUTE", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateSystemRoutes = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate
    payload.updated_by  = userData?.id

    const runupdate = await GlobalModel.Update(payload, 'routes', 'routes_id', payload.routes_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated system routes details`, function_name: 'UpdateSystemRoutes', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM ROUTE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated system routes details`, function_name: 'UpdateSystemRoutes', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM ROUTE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})