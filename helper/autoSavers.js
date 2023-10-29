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
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  autoDbProcessQuantity: async (req, newvalue, product_id, user_id) => {
    const runupdate = await ProductTakeOut(newvalue, product_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  autoDbOutletProcessQuantity: async (req, newvalue, product_id, user_id) => {
    const runupdate = await OrderTkeOut(newvalue, product_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },
  processOutletQuantity: async (req, newvalue, product_id, user_id,outlet_id) => {
    const runupdate = await OutletOrderTkeOut(newvalue, product_id,outlet_id)
    if (runupdate.rowCount == 1) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity`, function_name: 'processOutletQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 1


    } else {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity`, function_name: 'processOutletQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
      return progress = 0
    }


  },

}