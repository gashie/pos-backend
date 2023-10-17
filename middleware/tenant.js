const Model = require("../model/Tenant")
const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.tenantExist = asynHandler(async (req, res, next) => {
  let { tenant } = req.body


  const findbusiness = await Model.ValidateDynamicValue('tenant_name',tenant?.tenant_name)
  let BusinessInfo = findbusiness.rows[0]

  if (BusinessInfo) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, shop already exist", function_name: 'protect', date_started: systemDate, sql_action: "SELECT", event: "Sub-Account", actor: email }, req)
   return sendResponse(res, 0, 500, 'Sorry, shop already exist')
  }
  return next()


});