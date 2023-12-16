const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateSystemPermission = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.created_by = userData?.id
    let results = await GlobalModel.Create(payload, 'permissions','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New system permission added`, function_name: 'CreateSystemPermission', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSystemPermission', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.CreateRolePermission = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.created_by = userData?.id
    let results = await GlobalModel.Create(payload, 'role_permissions','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New role permission added`, function_name: 'CreateRolePermission', date_started: systemDate, sql_action: "INSERT", event: "CREATE ROLE PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateRolePermission', date_started: systemDate, sql_action: "INSERT", event: "CREATE ROLE PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewSystemPermission = asynHandler(async (req, res, next) => {
    let userData = req.user;
  
    const tableName = 'permissions';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewSystemPermission', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} system permission record's`, function_name: 'ViewSystemPermission', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM PERMISSION", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateSystemPermission = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate
    payload.updated_by  = userData?.id

    const runupdate = await GlobalModel.Update(payload, 'permissions', 'permission_id', payload.permission_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated system permission details`, function_name: 'UpdateSystemPermission', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated system permission details`, function_name: 'UpdateSystemPermission', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM PERMISSION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})