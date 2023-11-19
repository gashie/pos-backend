const GlobalModel = require("../model/Global");
const { OrderTkeOut, OutletOrderTkeOut } = require("../model/Order");
const { ProductTakeOut } = require("../model/Product");
const { CatchHistory } = require('./utilfunc');
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");
module.exports = {
  autoProcessQuantity: async (req, oldvalue, newvalue, action, product_id, user_id) => {
    let payload = {}
    let progress = 0
    if (action === 'add') {
      payload.prod_qty = Number(oldvalue) + Number(newvalue)
    } else {
      payload.prod_qty = Number(oldvalue) - Number(newvalue)
    }
    const runupdate = await GlobalModel.Update(payload, 'product', 'product_id', product_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  autoDbProcessQuantity: async (req, newvalue, product_id, user_id) => {
    const runupdate = await ProductTakeOut(newvalue, product_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  autoDbOutletProcessQuantity: async (req, newvalue, product_id, user_id) => {
    const runupdate = await OrderTkeOut(newvalue, product_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  processOutletQuantity: async (req, newvalue, product_id, user_id, outlet_id) => {
    const runupdate = await OutletOrderTkeOut(newvalue, product_id, outlet_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ api_response: `User with id :${user_id} updated product quantity`, function_name: 'processOutletQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity`, function_name: 'processOutletQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  autoCreateTransfer: async (req, transfer_from = 'warehouse', destinationOutlet,sourceOutlet) => {
    let userData = req.user;
    let payload = {}
    // transfer_from is warehouse set source to loggedin outlet name else if source is set, set source to source name
    let setSource = transfer_from === 'warehouse' ? 'WAREHOUSE' : sourceOutlet?.outlet_name.toUpperCase()
    payload.tenant_id = userData?.tenant_id
    payload.transfer_from = transfer_from
    let refresult = await GlobalModel.FetchRefCode(setSource, destinationOutlet?.outlet_name.toUpperCase());
    let refcode = refresult.rows[0].generate_ref_code
    payload.ref_code = refcode
    payload.processed_by = userData.id
    payload.source_outlet_id = transfer_from === 'warehouse' ? userData?.default_outlet_id : sourceOutlet?.outlet_id
    let results = await GlobalModel.Create(payload, 'transfer_stock', '');
    return results
  },
  autoCreateConsignment: async (item, transfer_id, destination_outlet_id, tenant_id, picked_up_by) => {
    let payload = {
      product_id: item.product_id,
      quantity: item?.qty,
      transfer_id,
      outlet_id: destination_outlet_id,
      tenant_id,
      picked_up_by,

    }
    let results = await GlobalModel.Create(payload, 'consignment', '');
    return results
  },
  autoReceiveItems: async (transfer_id, status='accept',item,destination_outlet_id,transfer_from,remarks,source_outlet_id,userData) => {
   
      let payload = {
          product_id: item.product_id,
          stock_quantity: item?.quantity,
          transfer_id,
          outlet_id: destination_outlet_id,
          tenant_id,
          processed_by: userData?.id,

      }

      if (transfer_from === "warehouse") { //deduct quantity from warehouse
          console.log('====================================');
          console.log(`processing warehouse transfer from source :warehouse to ${destination_outlet_id}`);
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
              await TransferTakeOut(item.quantity, item.product_id, destination_outlet_id)
          } else {
              await GlobalModel.Create(payload, 'outlet_inventory', '');
          }
      }
      if (transfer_from === "outlet") { //deduct quantity from outlet
          console.log('====================================');
          console.log(`processing outlet transfer from source :${source_outlet_id} to ${destination_outlet_id} with quantity ${item.quantity}`);
          console.log('====================================');
          processOutletQuantity(req, item.quantity, item.product_id, userData.id, source_outlet_id);
          const tableName2 = 'outlet_inventory';
          const columnsToSelect2 = ['product_id']; // find product from outlet if it exist
          const conditions2 = [
              { column: 'product_id', operator: '=', value: item?.product_id },
              { column: 'outlet_id', operator: '=', value: item?.outlet_id },
          ]
          let product = await GlobalModel.Finder(tableName2, columnsToSelect2, conditions2)
          let foundProduct = product.rows[0];
          if (foundProduct) {  //if found update quantity
              await TransferTakeOut(item.quantity, item.product_id, destination_outlet_id)
          } else {
              await GlobalModel.Create(payload, 'outlet_inventory', '');
          }


      }

  
 
      let detect_accept_status = 'accepted'
      let object_payload = {
          is_acknowledged: true,
          accept_status: detect_accept_status
      }
      await GlobalModel.Update(object_payload, 'transfer_stock', 'transfer_id', transfer_id)
      let ack_payload = {
          transfer_id,
          is_confirmed: true,
          remarks,
          status
      }
      await GlobalModel.Create(ack_payload, 'transfer_acknowledgment', '');

      return sendResponse(res, 1, 200, "Consignment received and acknowleged successfully", [])
  
  },
}