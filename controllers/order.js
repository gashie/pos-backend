const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")

const { autoProcessQuantity, autoDbProcessQuantity, autoDbOutletProcessQuantity, processOutletQuantity } = require("../helper/autoSavers");
const { calculatePaymentDetails } = require("../helper/global");
const { FetchOrderByDate, FetchOrderCardsByDate } = require("../model/Order");

const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.OldCreateOrder = asynHandler(async (req, res, next) => {
  //check if option value  exist for tenant
  let { items, notes, to_be_delivered, delivery_address, expected_payment_date, transaction_from, customer, payment_method } = req.body
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let payload = req.body;
  payload.tenant_id = tenant_id
  let ExistingProduct = req.product
  let ordered_list = []
  //generate order reference
  let refresult = await GlobalModel.FetchRef(userData?.company.toUpperCase());
  let refcode = refresult.rows[0].generate_order_code
  //perform calculation
  let { totalAmount, discount, charges, totalAmountPaid, balance, paymentMethod, totalAmountDue, totalAmountRemaining, totalToBePaid } = calculatePaymentDetails(req.body, 2);

  let orderPayload = {
    tenant_id,
    customer_id: customer,
    total_amount: totalAmount,
    status: totalAmountRemaining > 0 ? 'pending' : 'complete',
    payment_method: payment_method,
    outlet_id: userData?.default_outlet_id,
    processed_by: userData?.id,
    notes,
    order_reference: refcode,
    charge_percentage: 2,
    charge_amount: charges,
    discount_fee: discount,
    cash_received: totalAmountPaid,
    cash_balance: balance,
    to_be_delivered,
    delivery_address,
    amount_to_pay: totalToBePaid,
    paid_status: totalAmountRemaining > 0 ? 'unpaid' : 'paid',
    is_credit: paymentMethod === 'credit' ? true : false,
    total_amount_due: totalAmountDue,
    total_amount_remaining: totalAmountRemaining,
    expected_payment_date,
    transaction_from

  }
  //save order
  let results = await GlobalModel.Create(orderPayload, 'orders', '');
  let order_id = results.rows[0]?.order_id
  //autoProcessQuantity---
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const existingProduct = ExistingProduct[i];

    if (existingProduct && item) {
      let ordereditems = {
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty,
        outlet_id: userData?.default_outlet_id,
        tenant_id: tenant_id,
        processed_by: userData?.id,
        customer_id: customer,
      }

      await GlobalModel.Create(ordereditems, 'order_items', '');
      autoProcessQuantity(req, existingProduct.prod_qty, item.qty, 'sub', item.product_id, userData.id);
      console.log('====================================');
      console.log(existingProduct.prod_qty, item.qty, 'sub', item.product_id, userData.id);
      console.log('====================================');
    }
  }


  //
  let chargePayload = {
    charged_percentage: 2,
    charged_amount: charges,
    order_id,
    order_paid_status: totalAmountRemaining > 0 ? 'unpaid' : 'paid',
    tenant_id
  }

  let creditPayload = {
    order_id,
    customer_id: customer,
    total_amount_paid: totalAmountPaid,
    total_amount_due: totalAmountDue,
    total_amount_remaining: totalAmountRemaining,
    expected_payment_date,
    tenant_id,
    outlet_id: userData?.default_outlet_id,
    recorded_by: userData?.id,
    remarks: notes,
  }
  if (totalAmountRemaining > 0) {
    //save credit
    //save charges
    let credit_results = await GlobalModel.Create(creditPayload, 'credit_history', '');
    let charge_results = await GlobalModel.Create(chargePayload, 'fees_charged', '');
    if (credit_results.rowCount == 1 && charge_results.rowCount == 1) {
      CatchHistory({ api_response: `New sales added`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 1, 200, "Record saved", orderPayload)
    } else {
      CatchHistory({ api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


  } else {
    //save charges
    let charge_results = await GlobalModel.Create(chargePayload, 'fees_charged', '');
    if (charge_results.rowCount == 1) {
      CatchHistory({ api_response: `New stock added`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 1, 200, "Record saved", orderPayload)
    } else {
      CatchHistory({ api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


  }


})
exports.CreateOrder = asynHandler(async (req, res, next) => {
  //check if option value  exist for tenant
  let { items, notes, to_be_delivered, delivery_address, expected_payment_date, transaction_from, customer, payment_method,cash_received } = req.body
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let payload = req.body;
  payload.tenant_id = tenant_id
  let ExistingProduct = req.product
  let outlet_id = userData?.default_outlet_id
  //generate order reference
  let refresult = await GlobalModel.FetchRef(userData?.company.toUpperCase());
  let refcode = refresult.rows[0].generate_order_code
  //perform calculation
  let { totalAmount, discount, charges, totalAmountPaid, balance, paymentMethod, totalAmountDue, totalAmountRemaining, totalToBePaid } = calculatePaymentDetails(req.body, 2);

  let orderPayload = {
    tenant_id,
    customer_id: customer,
    total_amount: totalAmount,
    status: totalAmountRemaining > 0 ? 'pending' : 'complete',
    payment_method: payment_method,
    outlet_id: userData?.default_outlet_id,
    processed_by: userData?.id,
    notes,
    order_reference: refcode,
    charge_percentage: 2,
    charge_amount: charges,
    discount_fee: discount,
    cash_received,
    cash_balance: balance,
    to_be_delivered,
    delivery_address,
    amount_to_pay: totalToBePaid,
    paid_status: totalAmountRemaining > 0 ? 'unpaid' : 'paid',
    is_credit: paymentMethod === 'credit' ? true : false,
    total_amount_due: totalAmountDue,
    total_amount_remaining: totalAmountRemaining,
    expected_payment_date,
    transaction_from

  }
  //save order
  let results = await GlobalModel.Create(orderPayload, 'orders', '');
  let order_id = results.rows[0]?.order_id
  //autoProcessQuantity---
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const existingProduct = ExistingProduct[i];

    if (existingProduct && item) {
      let ordereditems = {
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty,
        outlet_id: userData?.default_outlet_id,
        tenant_id: tenant_id,
        processed_by: userData?.id,
        customer_id: customer,
      }

      await GlobalModel.Create(ordereditems, 'order_items', '');
      processOutletQuantity(req, item.qty, item.product_id, userData.id,outlet_id);
    }
  }


  //
  let chargePayload = {
    charged_percentage: 2,
    charged_amount: charges,
    order_id,
    order_paid_status: totalAmountRemaining > 0 ? 'unpaid' : 'paid',
    tenant_id
  }

  let creditPayload = {
    order_id,
    customer_id: customer,
    total_amount_paid: totalAmountPaid,
    total_amount_due: totalAmountDue,
    total_amount_remaining: totalAmountRemaining,
    expected_payment_date,
    tenant_id,
    outlet_id: userData?.default_outlet_id,
    recorded_by: userData?.id,
    remarks: notes,
  }
  if (totalAmountRemaining > 0) {
    //save credit
    //save charges
    let credit_results = await GlobalModel.Create(creditPayload, 'credit_history', '');
    let charge_results = await GlobalModel.Create(chargePayload, 'fees_charged', '');
    if (credit_results.rowCount == 1 && charge_results.rowCount == 1) {
      CatchHistory({ api_response: `New sales added`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 1, 200, "Record saved", orderPayload)
    } else {
      CatchHistory({ api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


  } else {
    //save charges
    let charge_results = await GlobalModel.Create(chargePayload, 'fees_charged', '');
    if (charge_results.rowCount == 1) {
      CatchHistory({ api_response: `New stock added`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 1, 200, "Record saved", orderPayload)
    } else {
      CatchHistory({ api_response: `Sorry, error saving record: contact administrator`, function_name: 'CreateOrder', date_started: systemDate, sql_action: "INSERT", event: "Buy product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


  }


})
exports.ViewGeneralOrderByDate = asynHandler(async (req, res) => {
  let { start, end } = req.body
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  var process_end_date = new Date(end);
  var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
  let today = new Date(final_end_date);
  let results = await FetchOrderByDate(start, today, tenant_id);
  let cards = await FetchOrderCardsByDate(start, today, tenant_id);
  if (results.rows.length == 0) {
    CatchHistory({ api_response: "No Record Found", function_name: 'ViewGeneralOrderByDate', date_started: systemDate, sql_action: "SELECT", event: `View order from ${start} - ${end}`, actor: '' }, req)
    return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
  }
  sendResponse(res, 1, 200, "Record Found", { cards_utilities: cards.rows, records: results.rows, })
})
