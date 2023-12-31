const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ViewLocationCascaded } = require("../../model/Location");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateParentLocation = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = {
        location_name:req.body.location_name,
        latitude:req.body.latitude,
        longitude:req.body.longitude

    }
    let results = await GlobalModel.Create(payload, 'location','');
    if (results.rowCount == 1) {
        CatchHistory({  api_response: `New parent location added`, function_name: 'CreateParentLocation', date_started: systemDate, sql_action: "INSERT", event: "CREATE LOCATION", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({  api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateParentLocation', date_started: systemDate, sql_action: "INSERT", event: "CREATE LOCATION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.CreateSubLocation = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let payload = {
        location_name:req.body.location_name,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        parent_location_id: req.body.parent_location_id

    }
    let results = await GlobalModel.Create(payload, 'location','');
    if (results.rowCount == 1) {
        CatchHistory({  api_response: `New sublocation added`, function_name: 'CreateSubLocation', date_started: systemDate, sql_action: "INSERT", event: "CREATE LOCATION", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        CatchHistory({  api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateSubLocation', date_started: systemDate, sql_action: "INSERT", event: "CREATE LOCATION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.ViewLocation = asynHandler(async (req, res, next) => {
    let userData = req.user;

    const tableName = 'location';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Location Record Found", function_name: 'ViewLocation', date_started: systemDate, sql_action: "SELECT", event: "VIEW PARENT LOCATION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} location record's`, function_name: 'ViewLocation', date_started: systemDate, sql_action: "SELECT", event: "VIEW PARENT LOCATION", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewSubLocation = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {location_id} = req.body

    const tableName = 'location';
    const columnsToSelect = []; // Use string values for column names
    const conditions = [
        { column: 'parent_location_id', operator: '=', value: location_id },
    ];
    let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Location Record Found", function_name: 'ViewSubLocation', date_started: systemDate, sql_action: "SELECT", event: "VIEW SUB LOCATION", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} sub location record's`, function_name: 'ViewSubLocation', date_started: systemDate, sql_action: "SELECT", event: "VIEW SUB LOCATION", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})

exports.ViewCascadedLocation = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let {parent_location_id} = req.body
    let results = await ViewLocationCascaded(parent_location_id);

    sendResponse(res, 1, 200, "Record Found", results)
})
exports.UpdateLocation = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate
    payload.updated_by = userData?.id

    const runupdate = await GlobalModel.Update(payload, 'location', 'location_id', payload.location_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated location details`, function_name: 'UpdateLocation', date_started: systemDate, sql_action: "UPDATE", event: "Update item unit", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated location details`, function_name: 'UpdateLocation', date_started: systemDate, sql_action: "UPDATE", event: "Update item unit", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})