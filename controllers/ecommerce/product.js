const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const ProductModel = require("../../model/Product")
const ProductOptionModel = require("../../model/ProductOption")


const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.ViewEcommerceProduct = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {tenant_id,outlet_id} = req?.client

    console.log('====================================');
    console.log({tenant_id,outlet_id});
    console.log('====================================');
    let results = await ProductModel.FindOutletProductByOutletId(outlet_id,tenant_id);
    if (results.rows.length == 0) {
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }

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