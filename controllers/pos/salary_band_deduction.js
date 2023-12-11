const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { FetchGroupBandDeduction } = require("../../model/GroupBand");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateSalaryBandDeduction = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'group_band_deduction','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New salary band allowance added`, function_name: 'CreateSalaryBandDeduction', date_started: systemDate, sql_action: "INSERT", event: "Create salary band allowance", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSalaryBandDeduction', date_started: systemDate, sql_action: "INSERT", event: "Create salary band allowance", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewSalaryBandDeduction = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await FetchGroupBandDeduction(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewSalaryBandDeduction', date_started: systemDate, sql_action: "SELECT", event: "View salary band allowance records", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} salary band allowance record's`, function_name: 'ViewSalaryAllowance', date_started: systemDate, sql_action: "SELECT", event: "View salary band allowance records", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateSalaryBandDeduction = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'group_band_deduction', 'band_deduction_id', payload.band_deduction_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated salary band allowance details`, function_name: 'UpdateSalaryBandDeduction', date_started: systemDate, sql_action: "UPDATE", event: "Update salary band allowance info", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated salary band allowance details`, function_name: 'UpdateSalaryBandDeduction', date_started: systemDate, sql_action: "UPDATE", event: "Update salary band allowance info", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})