const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { FetchAssignedUserGroupBands } = require("../../model/GroupBand");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.AssignUserGroupBand = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = req.body;
    payload.tenant_id = tenant_id
    let results = await GlobalModel.Create(payload, 'user_group_band','');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New group_band added`, function_name: 'AssignUserGroupBand', date_started: systemDate, sql_action: "INSERT", event: "Create group band", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'AssignUserGroupBand', date_started: systemDate, sql_action: "INSERT", event: "Create group band", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewUserAssignedGroupBands = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    
    let results = await FetchAssignedUserGroupBands(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewUserAssignedGroupBands', date_started: systemDate, sql_action: "SELECT", event: "View assigned group bands records", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} assigned assigned group bands record's`, function_name: 'ViewUserAssignedGroupBands', date_started: systemDate, sql_action: "SELECT", event: "View assigned assigned group bands records", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.UpdateAssignedGroupBand = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'user_group_band', 'user_group_band_id', payload.user_group_band_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated assigned group bands details`, function_name: 'UpdateAssignedGroupBand', date_started: systemDate, sql_action: "UPDATE", event: "Update assigned group bands info", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated assigned group bands detail`, function_name: 'UpdateAssignedGroupBand', date_started: systemDate, sql_action: "UPDATE", event: "Update group band info", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})