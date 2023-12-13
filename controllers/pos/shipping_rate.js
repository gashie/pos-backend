const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateShippingRate = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'shipping_rate','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New shipping rate added`, function_name: 'CreateShippingRate', date_started: systemDate, sql_action: "INSERT", event: "CREATE SHIPPING RATE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateShippingRate', date_started: systemDate, sql_action: "INSERT", event: "CREATE SHIPPING RATE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewShippingRate = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let {carrier_id} = req.body
    let results = await GlobalModel.Find('carrier_id', carrier_id, 'shipping_rate');
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewShippingRate', date_started: systemDate, sql_action: "SELECT", event: "VIEW SHIPPING RATE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} shipping rate record's`, function_name: 'ViewShippingRate', date_started: systemDate, sql_action: "SELECT", event: "VIEW SHIPPING RATE", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateShippingRate = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'shipping_rate', 'carrier_id', payload.carrier_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated shipping rate details`, function_name: 'UpdateShippingRate', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SHIPPING RATE", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated shipping rate details`, function_name: 'UpdateShippingRate', date_started: systemDate, sql_action: "UPDATE", event: "UPDATE SHIPPING RATE", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})