const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateBankAccount = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'bank_accounts','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New bank account added`, function_name: 'CreateBankAccount', date_started: systemDate, sql_action: "INSERT", event: "Create bank account", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateBankAccount', date_started: systemDate, sql_action: "INSERT", event: "Create bank account", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewBankAccount = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'bank_accounts');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewBankAccount', date_started: systemDate, sql_action: "SELECT", event: "View bank account records", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} bank account record's`, function_name: 'ViewBankAccount', date_started: systemDate, sql_action: "SELECT", event: "View bank account records", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateBankAccount = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'bank_accounts', 'bank_account_id', payload.bank_account_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated bank account details`, function_name: 'UpdateBankAccount', date_started: systemDate, sql_action: "UPDATE", event: "Update bank account info", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated bank account details`, function_name: 'UpdateBankAccount', date_started: systemDate, sql_action: "UPDATE", event: "Update bank account info", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})