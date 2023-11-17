const { generateApiKey } = require('generate-api-key');
const bcyrpt = require("bcrypt");

const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateShop = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    payload.is_electronic = false
    payload.is_main_outlet = false

    let results = await GlobalModel.Create(payload, 'outlet', 'outlet_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New shop added`, function_name: 'CreateShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.CreateEcommerceShop = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    payload.is_electronic = true
    payload.is_main_outlet = false


    let results = await GlobalModel.Create(payload, 'outlet', '');
    if (results.rowCount == 1) {
        let generatekey = generateApiKey({
            method: 'uuidv4',
            name: payload.outlet_name.replace(/ /g, "_"),
            namespace: results.rows[0].outlet_id,
            prefix: `eco_${payload.outlet_name.replace(/ /g, "_")}`
        });
        const salt = await bcyrpt.genSalt(10);
        let token_value = await bcyrpt.hash(generatekey, salt);
        let ecomkeys = {
            outlet_id: results.rows[0].outlet_id,
            api_key: token_value,
        }
        await GlobalModel.Create(ecomkeys, 'outlet_api_keys', '')
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New ecommerce shop added`, function_name: 'CreateEcommerceShop', date_started: systemDate, sql_action: "INSERT", event: "Create Ecommerce Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", {ecommerce_outlet:results.rows,api_key:generatekey})
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateEcommerceShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewTenantMainShop = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id

    const tableName = 'outlet';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
        { column: 'tenant_id', operator: '=', value: tenant_id },
        { column: 'is_main_outlet', operator: '=', value: true },
        { column: 'is_electronic', operator: '=', value: false },
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)

    const conditionsTwo = [
        { column: 'tenant_id', operator: '=', value: tenant_id },
        { column: 'is_main_outlet', operator: '=', value: false },
        { column: 'is_electronic', operator: '=', value: false },
    ];
    let resultsTwo = await GlobalModel.Finder(tableName, columnsToSelect, conditionsTwo)

    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} shop record's`, function_name: 'ViewTenantMainShop', date_started: systemDate, sql_action: "SELECT", event: "Dropdown and view outlet main shop and non main shop before switching", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", { main_shop: results.rows, non_main: resultsTwo.rows })
})

exports.ViewTenantShops = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'outlet');
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
    let results = await GlobalModel.Find('tenant_id', tenant_id, 'outlet');
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
    const runupdate = await GlobalModel.Update(payload, 'outlet', 'outlet_id', payload.outlet_id)
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
        CatchHistory({ payload: JSON.stringify(payload), api_response: `User with id ${userData.id} assigned ${payload.user_id} to outlet with id ${payload.outlet_id} as ${payload.role}`, function_name: 'AssignToShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'AssignToShop', date_started: systemDate, sql_action: "INSERT", event: "Create Shop", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.SwitchMainOutlet = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate
    let main_outlet_id = payload.main_outlet_id
    let new_main_outlet_id = payload.new_main_outlet_id

    let previousMain = {
        is_main_outlet: false,
        updated_at: systemDate
    }
    let newMain = {
        is_main_outlet: true,
        updated_at: systemDate
    }
    const runoldmainupdate = await GlobalModel.Update(previousMain, 'outlet', 'outlet_id', main_outlet_id)
    const runnewmainupdate = await GlobalModel.Update(newMain, 'outlet', 'outlet_id', new_main_outlet_id)
    if (runoldmainupdate.rowCount == 1 && runnewmainupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} switched main shop from ${main_outlet_id} to ${new_main_outlet_id}`, function_name: 'SwitchMainOutlet', date_started: systemDate, sql_action: "UPDATE", event: `switch main shop from ${main_outlet_id} to ${new_main_outlet_id}`, actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated", runnewmainupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} tried switching main shop from ${main_outlet_id} to ${new_main_outlet_id}`, function_name: 'SwitchMainOutlet', date_started: systemDate, sql_action: "UPDATE", event: `switch main shop from ${main_outlet_id} to ${new_main_outlet_id}`, actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})