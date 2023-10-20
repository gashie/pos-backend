const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")
const ProductOptionValueModel = require("../model/ProductOptionValue");
const InventoryModel = require("../model/Inventory");

const { autoProcessQuantity, autoProcessOptionValueQuantity } = require("../helper/autoSavers");

const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateInventory = asynHandler(async (req, res, next) => {
    //check if option value  exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let ExistingProduct = req.product
    //if item value quantity is greater than 0--> increase the prduct quantity
    autoProcessQuantity(req,ExistingProduct.prod_qty,payload.qty,'add',payload.product_id,userData.id)
     payload.old_qty = ExistingProduct.prod_qty
     payload.added_by = userData.id 
    let results = await GlobalModel.Create(payload, 'inventory','stock_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New stock added`, function_name: 'CreateInventory', date_started: systemDate, sql_action: "INSERT", event: "Create Inventory", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateInventory', date_started: systemDate, sql_action: "INSERT", event: "Create Inventory", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})

exports.SearchInventory = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let { product_option_id } = req.body
    let results = await ProductOptionValueModel.Find(product_option_id);

    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'SearchTenantProductValue', date_started: systemDate, sql_action: "SELECT", event: "Product Option Value Search", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} searched for option value with id ${product_option_id}`, function_name: 'SearchTenantProductValue', date_started: systemDate, sql_action: "SELECT", event: "Product Option Value Search", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateInventory = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    payload.updated_at = systemDate
    let ExistingProduct = req.product
    let ExistingProductOptionValue = req.productoptionval
     //if item value quantity is greater than 0--> increase the prduct quantity
     if (payload.product_id || payload.product_id !== ""  && payload.product_option_value_id === "") {
        //increase only product quantity
       autoProcessQuantity(req,ExistingProduct.prod_qty,payload.qty,'add',payload.product_id,userData.id)
    }
    if (payload.product_id || payload.product_id !== ""  && payload.product_option_value_id !== "") {
        //increase product quantity and product option value too
       autoProcessQuantity(req,ExistingProduct.prod_qty,payload.qty,'add',payload.product_id,userData.id)
       autoProcessOptionValueQuantity(req,ExistingProductOptionValue.qty,payload.qty,'add',payload.product_option_value_id,userData.id)

    }
    const runupdate = await GlobalModel.Update(payload, 'inventory', 'stock_id', payload.stock_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated stock}`, function_name: 'UpdateInventory', date_started: systemDate, sql_action: "UPDATE", event: "Update Inventory", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated")


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} failed to update stock}`, function_name: 'UpdateInventory', date_started: systemDate, sql_action: "UPDATE", event: "Update Inventory", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})
exports.ViewTenantInventory = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await InventoryModel.FetchInventory(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantInventory', date_started: systemDate, sql_action: "SELECT", event: "Inventory View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} inventory record's`, function_name: 'ViewTenantInventory', date_started: systemDate, sql_action: "SELECT", event: "Inventory View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewTenantInventoryHistory = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await InventoryModel.FetchInventoryHistory(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantInventory', date_started: systemDate, sql_action: "SELECT", event: "Inventory View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} inventory record's`, function_name: 'ViewTenantInventory', date_started: systemDate, sql_action: "SELECT", event: "Inventory View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})