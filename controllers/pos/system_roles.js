const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ShowUserRoles } = require("../../model/Account");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateSystemRole = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.created_by = userData?.id
    let results = await GlobalModel.Create(payload, 'roles','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New system role added`, function_name: 'CreateSystemRole', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM ROLE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSystemRole', date_started: systemDate, sql_action: "INSERT", event: "CREATE SYSTEM ROLE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.CreateUserRole = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.created_by = userData?.id
    let results = await GlobalModel.Create(payload, 'user_roles','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New user role added`, function_name: 'CreateUserRole', date_started: systemDate, sql_action: "INSERT", event: "CREATE USER ROLE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateUserRole', date_started: systemDate, sql_action: "INSERT", event: "CREATE USER ROLE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewSystemRole = asynHandler(async (req, res, next) => {
    let userData = req.user;
  
    const tableName = 'roles';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewSystemRole', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM ROLE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} system role record's`, function_name: 'ViewSystemRole', date_started: systemDate, sql_action: "SELECT", event: "VIEW SYSTEM ROLE", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewUserRole = asynHandler(async (req, res, next) => {
    let userData = req.user;
  
    let results = await ShowUserRoles()
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewUserRole', date_started: systemDate, sql_action: "SELECT", event: "VIEW USER ROLE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} system role record's`, function_name: 'ViewUserRole', date_started: systemDate, sql_action: "SELECT", event: "VIEW USER ROLE", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateSystemRole = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate
    payload.updated_by  = userData?.id

    const runupdate = await GlobalModel.Update(payload, 'roles', 'role_id', payload.role_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated system roles details`, function_name: 'UpdateSystemRole', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM ROLE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated system roles details`, function_name: 'UpdateSystemRole', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SYSTEM ROLE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})