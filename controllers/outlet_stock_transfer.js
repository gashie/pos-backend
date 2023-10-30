const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")
const ProductOptionValueModel = require("../model/ProductOptionValue");
const InventoryModel = require("../model/Inventory");

const { autoProcessQuantity, autoProcessOptionValueQuantity, autoProcessOutletQuantity, autoDbProcessQuantity, processOutletQuantity } = require("../helper/autoSavers");
const { FetchTransferData, deleteTransfer, TransferTakeOut, FindTransferData } = require("../model/Transfer");
const { FindOutletProductByOutletId, FindItemsToPick } = require("../model/Product");

const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.SendStockToOutlet = asynHandler(async (req, res, next) => {
    //check if option value  exist for tenant
    let userData = req.user;
    let destinationOutlet = req.outlet
    let sourceOutlet = req.source_outlet
    let transfer_from = req.body.transfer_from
    let payload = req.body;
    // transfer_from is warehouse set source to loggedin outlet name else if source is set, set source to source name
    let setSource = transfer_from === 'warehouse' ? 'WAREHOUSE' : sourceOutlet?.outlet_name.toUpperCase()
    // let setSourceUid = transfer_from === 'warehouse' ? userData?.default_outlet_id : payload?.source_outlet_id
    let tenant_id = userData?.tenant_id
    payload.tenant_id = tenant_id
    let refresult = await GlobalModel.FetchRefCode(setSource, destinationOutlet?.outlet_name.toUpperCase());
    let refcode = refresult.rows[0].generate_ref_code
    payload.ref_code = refcode
    payload.processed_by = userData.id
    payload.source_outlet_id = transfer_from === 'warehouse' ? userData?.default_outlet_id : payload?.source_outlet_id
    let results = await GlobalModel.Create(payload, 'transfer_stock', '');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New transfer initiated`, function_name: 'SendStockToOutlet', date_started: systemDate, sql_action: "INSERT", event: "Create Inventory", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record saved", results?.rows)
    } else {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving stock transfer request: contact administrator`, function_name: 'SendStockToOutlet', date_started: systemDate, sql_action: "INSERT", event: "Create Inventory", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error saving stock transfer request: contact administrator", [])

    }

})

exports.ViewStockTransfer = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await FetchTransferData(start, today, tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewStockTransfer', date_started: systemDate, sql_action: "SELECT", event: `View stock transfer from ${start} - ${end}`, actor: userData?.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    sendResponse(res, 1, 200, "Record Found", results.rows)
})
exports.ViewStocksForTransfer = asynHandler(async (req, res) => {
    let userData = req.user;
    let { transfer_id } = req.body
    let tenant_id = userData?.tenant_id
    let trasferData = req.transfer
    let results = await FindTransferData(transfer_id, tenant_id);
    let source_outlet_product = await FindOutletProductByOutletId(trasferData?.source_outlet_id, tenant_id);

    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewStockTransfer', date_started: systemDate, sql_action: "SELECT", event: `View stock transfer from ${start} - ${end}`, actor: userData?.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    sendResponse(res, 1, 200, "Record Found", { transfer_info: results.rows, product_count: source_outlet_product.rows.length, product_from_source: source_outlet_product.rows })

})
exports.ViewStocksPickedForTransfer = asynHandler(async (req, res) => {
    let userData = req.user;
    let { transfer_id } = req.body
    let tenant_id = userData?.tenant_id
    let trasferData = req.transfer
    let results = await FindTransferData(transfer_id, tenant_id);
    let pickupitems = await FindItemsToPick(transfer_id);

    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewStocksPickedForTransfer', date_started: systemDate, sql_action: "SELECT", event: `View items to pick up transfer`, actor: userData?.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    sendResponse(res, 1, 200, "Record Found", { transfer_info: results.rows, items_count: pickupitems.rows.length, product_to_pickup: pickupitems.rows })

})
exports.CancelTransfer = asynHandler(async (req, res, next) => {
    let { transfer_id } = req.body;
    let userData = req.user;
    let tenant_id = userData?.tenant_id

    const runupdate = await deleteTransfer(transfer_id, tenant_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} updated customer details`, function_name: 'CancelTransfer', date_started: systemDate, sql_action: "DELETE", event: `Delete or cancel transfer with id of ${transfer_id}`, actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated", runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} updated customer details`, function_name: 'CancelTransfer', date_started: systemDate, sql_action: "UPDATE", event: `Delete or cancel transfer with id of ${transfer_id}`, actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})

exports.PickUpConsignment = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let items = req.body.items;
    let { transfer_id } = req.body
    let itemCount = items.length;

    let trasferData = req.transfer
    let isDone = false
    let tenant_id = userData?.tenant_id
    for (const item of items) {
        let payload = {
            product_id: item.product_id,
            quantity: item?.qty,
            transfer_id,
            outlet_id: trasferData.destination_outlet_id,
            tenant_id,
            picked_up_by: userData?.id,

        }
        await GlobalModel.Create(payload, 'consignment', '');
        if (!--itemCount) {
            isDone = true;
            console.log(" => This is the last iteration...");

        } else {
            console.log(" => Still saving data...");

        }
    }
    if (isDone) {
        // GlobalModel.Update('job_info', { hasQuestions: true }, 'jobId', jobId);
        let constructedMessage = items.length == 1 ? `${items.length} item picked up successfully` : items.length > 1 ? `${items.length} items picked up successfully` : `${items.length} item picked up successfully`
        return sendResponse(res, 1, 200, constructedMessage, items)
    }
})

exports.ReceiveConsignment = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let { transfer_id, status, remarks } = req.body
    let tenant_id = userData?.tenant_id
    let trasferData = req.transfer

    if (status === "reject") {
        // update transfer data,
        let detect_accept_status = status === 'accept' ? 'accepted' : 'rejected'
        let object_payload = {
            is_acknowledged: true,
            accept_status: detect_accept_status
        }
        await GlobalModel.Update(object_payload, 'transfer_stock', 'transfer_id', transfer_id)
        //update aknowlegment
        let payload = {
            transfer_id,
            is_confirmed: true,
            remarks,
            status
        }
        let results = await GlobalModel.Create(payload, 'transfer_acknowledgment', '');
        if (results.rowCount == 1) {
            CatchHistory({ payload: JSON.stringify(payload), api_response: `New acknowledgement added`, function_name: 'ReceiveConsignment', date_started: systemDate, sql_action: "INSERT", event: "Acknowledge consignment", actor: userData.id }, req)
            return sendResponse(res, 1, 200, "Consignment  acknowleged and rejected", payload)
        } else {
            CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'ReceiveConsignment', date_started: systemDate, sql_action: "INSERT", event: "Acknowledge consignment", actor: userData.id }, req)
            return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

        }
    }
    if (status === "accept") {
        let isDone = false
        //check consignment for data--- loop


        const tableName = 'consignment';
        const columnsToSelect = []; // Use string values for column names
        const conditions = [
            { column: 'transfer_id', operator: '=', value: transfer_id },
            { column: 'tenant_id', operator: '=', value: tenant_id },
        ]
        let results = await GlobalModel.Finder(tableName, columnsToSelect, conditions)

        let itemCount = results.rows.length;
        for (const item of results.rows) {
            let payload = {
                product_id: item.product_id,
                stock_quantity: item?.quantity,
                transfer_id,
                outlet_id: item.outlet_id,
                tenant_id,
                processed_by: userData?.id,

            }

            if (trasferData?.transfer_from === "warehouse") { //deduct quantity from warehouse
                console.log('====================================');
                console.log(`processing warehouse transfer from source :warehouse to ${item.outlet_id}`);
                console.log('====================================');
                autoDbProcessQuantity(req, item.quantity, item.product_id, userData.id);

                const tableName2 = 'outlet_inventory';
                const columnsToSelect2 = ['product_id']; // find product from outlet if it exist
                const conditions2 = [
                    { column: 'product_id', operator: '=', value: item?.product_id },
                    { column: 'outlet_id', operator: '=', value: item?.outlet_id },
                ]
                let product = await GlobalModel.Finder(tableName2, columnsToSelect2, conditions2)
                let foundProduct = product.rows[0];
                if (foundProduct) {  //if found update quantity
                    await TransferTakeOut(item.quantity, item.product_id, item.outlet_id)
                } else {
                    await GlobalModel.Create(payload, 'outlet_inventory', '');
                }
            }
            if (trasferData?.transfer_from === "outlet") { //deduct quantity from outlet
                console.log('====================================');
                console.log(`processing outlet transfer from source :${trasferData.source_outlet_id} to ${item.outlet_id} with quantity ${item.quantity}`);
                console.log('====================================');
                processOutletQuantity(req, item.quantity, item.product_id, userData.id, trasferData.source_outlet_id);
                const tableName2 = 'outlet_inventory';
                const columnsToSelect2 = ['product_id']; // find product from outlet if it exist
                const conditions2 = [
                    { column: 'product_id', operator: '=', value: item?.product_id },
                    { column: 'outlet_id', operator: '=', value: item?.outlet_id },
                ]
                let product = await GlobalModel.Finder(tableName2, columnsToSelect2, conditions2)
                let foundProduct = product.rows[0];
                if (foundProduct) {  //if found update quantity
                    await TransferTakeOut(item.quantity, item.product_id, item.outlet_id)
                } else {
                    await GlobalModel.Create(payload, 'outlet_inventory', '');
                }


            }

            if (!--itemCount) {
                isDone = true;
                console.log(" => This is the last iteration...");

            } else {
                console.log(" => Still saving data...");

            }
        }
        if (isDone) {
            let detect_accept_status = status === 'accept' ? 'accepted' : 'rejected'
            let object_payload = {
                is_acknowledged: true,
                accept_status: detect_accept_status
            }
            await GlobalModel.Update(object_payload, 'transfer_stock', 'transfer_id', transfer_id)
            let payload = {
                transfer_id,
                is_confirmed: true,
                remarks,
                status
            }
            await GlobalModel.Create(payload, 'transfer_acknowledgment', '');

            return sendResponse(res, 1, 200, "Consignment received and acknowleged successfully", [])
        }
        // update transfer data,
        //update aknowlegment
        //update outlet inventory
    }


})