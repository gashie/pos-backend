const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateSalaryDeduction = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'salary_deduction','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New salary deduction added`, function_name: 'CreateSalaryDeduction', date_started: systemDate, sql_action: "INSERT", event: "Create salary deduction", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSalaryDeduction', date_started: systemDate, sql_action: "INSERT", event: "Create salary deduction", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewSalaryDeduction = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'salary_deduction');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewSalaryDeduction', date_started: systemDate, sql_action: "SELECT", event: "View salary deduction records", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} salary deduction record's`, function_name: 'ViewSalaryDeduction', date_started: systemDate, sql_action: "SELECT", event: "View salary deduction records", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateSalaryDeduction = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'salary_deduction', 'salary_deduction_id', payload.salary_deduction_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated salary deduction details`, function_name: 'UpdateSalaryDeduction', date_started: systemDate, sql_action: "UPDATE", event: "Update salary deduction info", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated salary deduction details`, function_name: 'UpdateSalaryDeduction', date_started: systemDate, sql_action: "UPDATE", event: "Update salary deduction info", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})