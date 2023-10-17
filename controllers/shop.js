const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateShop = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    if (payload.is_main_shop == true) {
        await GlobalModel.Update({ is_main_shop: false }, 'shops', 'tenant_id', payload.tenant_id)
    }
    let results = await GlobalModel.Create(payload, 'shops', 'shop_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New shop added`, function_name: 'CreateShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewTenantShops = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'shops');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantShops', date_started: systemDate, sql_action: "SELECT", event: "Shop View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} shop record's`, function_name: 'ViewTenantShops', date_started: systemDate, sql_action: "SELECT", event: "Shop View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewMyAssignedShops = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'shops');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantShops', date_started: systemDate, sql_action: "SELECT", event: "Shop View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} shop record's`, function_name: 'ViewTenantShops', date_started: systemDate, sql_action: "SELECT", event: "Shop View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateShop = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'shops', 'shop_id', payload.shop_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated shop details}`, function_name: 'UpdateShop', date_started: systemDate, sql_action: "UPDATE", event: "Update Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated", runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} tried updating shop details}`, function_name: 'UpdateShop', date_started: systemDate, sql_action: "UPDATE", event: "Update Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})

exports.AssignToShop = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'shop_user_access', 'access_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `User with id ${userData.id} assigned ${payload.user_id} to shop with id ${payload.shop_id} as ${payload.role}`, function_name: 'AssignToShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'AssignToShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})