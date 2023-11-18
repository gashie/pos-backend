const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.ViewEcommerceCategory = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {tenant_id} = req?.client
    let results = await GlobalModel.Find('tenant_id',tenant_id,'categories');
    if (results.rows.length == 0) {
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
