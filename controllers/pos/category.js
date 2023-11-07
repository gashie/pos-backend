const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateCategory = asynHandler(async (req, res, next) => {
    //check if category exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'categories','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New category added`, function_name: 'CreateCategory', date_started: systemDate, sql_action: "INSERT", event: "Create Category", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    }else{
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateCategory', date_started: systemDate, sql_action: "INSERT", event: "Create Category", actor: userData.id }, req)
       return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewTenantCategory = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id',tenant_id,'categories');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} category record's`, function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateCategory = asynHandler(async (req, res, next) => {
    let { category_id ,category_name,description} = req.body;
    let userData = req.user;
    let tenant_id = userData?.tenant_id

    let Payload = {
        category_name,
        description,
        updated_at:systemDate
    }

     const runupdate = await GlobalModel.Update(Payload,'categories','category_id',category_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated category to ${category_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated category to ${category_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})