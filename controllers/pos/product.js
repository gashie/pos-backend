const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const ProductModel = require("../../model/Product")
const ProductOptionModel = require("../../model/ProductOption")


const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateProduct = asynHandler(async (req, res, next) => {
    //check if product exist for tenant
    let payload = req.body;
    let userData = req.user;
    let pic = req?.files?.prod_pic;
    var prodPicUploadLink = "./upload/images/products/";
    let prod_pic = `${pic?.name}`
    let tenant_id = userData?.tenant_id
    payload.tenant_id = tenant_id
    payload.prod_pic =  prod_pic

    console.log(payload);
    let results = await GlobalModel.Create(payload, 'product', 'product_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify({ prod_name: payload.prod_name, serial: payload.serial }), api_response: `New product added`, function_name: 'CreateProduct', date_started: systemDate, sql_action: "INSERT", event: "Create Product", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results.rows[0])
    } else {
        CatchHistory({ payload: JSON.stringify({ prod_name: payload.prod_name, serial: payload.serial }), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateProduct', date_started: systemDate, sql_action: "INSERT", event: "Create Product", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewTenantProduct = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await ProductModel.ViewProduct(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} product record's`, function_name: 'ViewTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewTenantOutletProduct = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let default_outlet_id = userData?.default_outlet_id
    let results = await ProductModel.FindOutletProductByOutletId(default_outlet_id,tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantOutletProduct', date_started: systemDate, sql_action: "SELECT", event: `Viewing ${results.rows.length} product's from ${userData?.company}`, actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} product record's`, function_name: 'ViewTenantOutletProduct', date_started: systemDate, sql_action: "SELECT", event: "Product View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.SearchTenantProduct = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let default_outlet_id = userData?.default_outlet_id

    let { serial } = req.body
    let results = await ProductModel.FindBySerial(serial, tenant_id,default_outlet_id);

    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'SearchTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product Search By Serial", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} searched for ${serial}`, function_name: 'SearchTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product Search By Serial", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", {item:results.rows[0]})
})

exports.FindTenantProduct = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let default_outlet_id = userData?.default_outlet_id

    let { id } = req.body
    let results = await ProductModel.FindOutletProductById(id, tenant_id,default_outlet_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'FindTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product Search By Id", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} searched for ${id}`, function_name: 'FindTenantProduct', date_started: systemDate, sql_action: "SELECT", event: "Product Search By Id", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows[0])
})
exports.UpdateProduct = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    let pic = req?.files?.prod_pic;
    var prodPicUploadLink = "./Upload/";
    let prod_pic = `${prodPicUploadLink}${pic?.name}`
    payload.prod_pic =  payload.net_image.length > 0 ? null: prod_pic
    payload.updated_at = systemDate
    let ExistingProduct = req.product
    if (pic) {
        console.log('theres pic');
        payload.prod_pic = prod_pic

    }else{
       delete payload.prod_pic
    }
if (payload.prod_qty) {
    payload.prod_qty = Number(ExistingProduct.prod_qty) + Number(payload.prod_qty)
}
    const runupdate = await GlobalModel.Update(payload, 'product', 'product_id', payload.product_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated product details}`, function_name: 'UpdateProduct', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} tried to update product details}`, function_name: 'UpdateProduct', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})