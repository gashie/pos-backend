const Model = require("../model/Account")
const CategoryModel = require("../model/Category")
const SupplieryModel = require("../model/Supplier")
const ProductModel = require("../model/Product")
const ProductOptionValueModel = require("../model/ProductOptionValue")


const asynHandler = require("./async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const { Finder } = require("../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.accountExist = asynHandler(async (req, res, next) => {
  let { account } = req.body

  let { email, phone, username } = account

  // const tableName = 'account';
  // const columnsToSelect = [];
  // const conditions = [
  //   { column: 'email', operator: '=', value: email },
  //   // { column: 'rateStatus', operator: '=', value: 'approved' },
  //   // { column: 'columnNameToCheck', operator: 'IS NOT NULL' },
  //   // { column: 'approvedAt', operator: '>=', value: 'NOW() - INTERVAL \'14 days\'', isDateColumn: true },
  //   // Add more conditions as needed, including different date columns
  // ];

  // let results = await Finder(tableName, columnsToSelect, conditions)

  const findemail = await Model.ValidateDynamicValue('email', email)
  let EmailInfo = findemail.rows[0]
  const findphone = await Model.ValidateDynamicValue('phone', phone)
  let PhoneInfo = findphone.rows[0]
  const findusername = await Model.ValidateDynamicValue('username', username)
  let UserInfo = findusername.rows[0]

  if (EmailInfo || PhoneInfo || UserInfo) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, account already exist", function_name: 'protect', date_started: systemDate, sql_action: "SELECT", event: "accountExist", actor: email }, req)
    return sendResponse(res, 0, 200, 'Sorry, account already exist')
  }
  return next()


});
exports.alreadyAssigned = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let { outlet_id, user_id, role } = req.body

  const tableName = 'shop_user_access';
  const columnsToSelect = ['user_id', 'outlet_id', 'role']; // Use string values for column names
  const conditions = [
    { column: 'user_id', operator: '=', value: user_id },
    { column: 'outlet_id', operator: '=', value: outlet_id },
    { column: 'role', operator: '=', value: role },
  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]

  if (ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, user has already been assigned to the same shop with same role", function_name: 'protect', date_started: systemDate, sql_action: "SELECT", event: "alreadyAssigned", actor: userData?.id }, req)
    return sendResponse(res, 0, 200, 'Sorry, user has already been assigned to the same shop with same role')
  }
  return next()


});
exports.findOutlet = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { destination_outlet_id,source_outlet_id,transfer_from } = req.body

  const tableName = 'outlet';
  const columnsToSelect = ['outlet_name']; // Use string values for column names
  const conditions = [
    { column: 'outlet_id', operator: '=', value: destination_outlet_id },
    { column: 'tenant_id', operator: '=', value: tenant_id },

  ];
  const conditions2 = [
    { column: 'outlet_id', operator: '=', value: source_outlet_id },
    { column: 'tenant_id', operator: '=', value: tenant_id },

  ];
  if (transfer_from === 'warehouse') {
    let results = await Finder(tableName, columnsToSelect, conditions)
    let ObjectExist = results.rows[0]
  
    if (!ObjectExist) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, this outlet does not exist", function_name: 'findOutlet', date_started: systemDate, sql_action: "SELECT", event: "find outlet if it exist", actor: userData?.id }, req)
      return sendResponse(res, 0, 200, 'Sorry, this outlet does not exist')
    }
    req.outlet = ObjectExist;
    return next()
  }

  if (destination_outlet_id === source_outlet_id) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, source and destination cannot be the same", function_name: 'findOutlet', date_started: systemDate, sql_action: "SELECT", event: "found source and destination to be the same", actor: userData?.id }, req)
    return sendResponse(res, 0, 200, 'Sorry, source and destination cannot be the same')
  }

  if (transfer_from === 'outlet') {
    let results = await Finder(tableName, columnsToSelect, conditions)
    let ObjectExist = results.rows[0]
  
    let results2 = await Finder(tableName, columnsToSelect, conditions2)
    let ObjectExist2 = results2.rows[0]
  
    if (!ObjectExist && !ObjectExist2) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, this outlet does not exist", function_name: 'findOutlet', date_started: systemDate, sql_action: "SELECT", event: "find outlet if it exist", actor: userData?.id }, req)
      return sendResponse(res, 0, 200, 'Sorry, this outlet does not exist')
    }
    req.outlet = ObjectExist;
    req.source_outlet = ObjectExist2;
    return next()
  }


});
exports.findTransfer = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { transfer_id } = req.body

  const tableName = 'transfer_stock';
  const columnsToSelect = ['ref_code', 'reference', 'is_acknowledged', 'destination_outlet_id','transfer_from','source_outlet_id']; // Use string values for column names
  const conditions = [
    { column: 'transfer_id', operator: '=', value: transfer_id },
    { column: 'tenant_id', operator: '=', value: tenant_id },

  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]

  if (!ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, this transfer request does not exist", function_name: 'findTransfer', date_started: systemDate, sql_action: "SELECT", event: "find transfer request if it exist", actor: userData?.id }, req)
    return sendResponse(res, 0, 200, 'Sorry, this transfer request does not exist')
  }
  req.transfer = ObjectExist;
  return next()


});
exports.findTransferNotApproved = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { transfer_id } = req.body

  const tableName = 'transfer_stock';
  const columnsToSelect = ['ref_code', 'reference', 'is_acknowledged', 'destination_outlet_id','transfer_from','source_outlet_id']; // Use string values for column names
  const conditions = [
    { column: 'transfer_id', operator: '=', value: transfer_id },
    { column: 'tenant_id', operator: '=', value: tenant_id },

  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]

  if (!ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, this transfer request does not exist", function_name: 'findTransfer', date_started: systemDate, sql_action: "SELECT", event: "find transfer request if it exist", actor: userData?.id }, req)
    return sendResponse(res, 0, 200, 'Sorry, this transfer request does not exist')
  }
  if (ObjectExist?.is_acknowledged === true) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: "Sorry, this transfer request has already been acknowledged", function_name: 'findTransfer', date_started: systemDate, sql_action: "SELECT", event: "find transfer request if it exist", actor: userData?.id }, req)
    return sendResponse(res, 0, 200, 'Sorry, this transfer request has already been acknowledged')
  }
  req.transfer = ObjectExist;
  return next()


});
//check if category exist for same tenant

// exports.catExist = asynHandler(async (req, res, next) => {
//   let userData = req.user;
//   let tenant_id = userData?.tenant_id
//   let { category_name } = req.body

//   const find = await CategoryModel.checkExist(category_name, tenant_id)
//   let ExistingInfo = find.rows[0]

//   if (ExistingInfo) {
//     CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, category with name ${category_name} already exist`, function_name: 'catExist', date_started: systemDate, sql_action: "SELECT", event: "add category", actor: userData.id }, req)
//     return sendResponse(res, 0, 200, `Sorry, category with name ${category_name} already exist`)
//   }
//   return next()


// });

//check if supplier exist for same tenant
exports.supplierExist = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { supplier_name } = req.body

  const tableName = 'suppliers';
  const columnsToSelect = ['supplier_name', 'tenant_id']; // Use string values for column names
  const conditions = [
    { column: 'supplier_name', operator: '=', value: supplier_name },
    { column: 'tenant_id', operator: '=', value: tenant_id },
  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]
  if (ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, supplier with name ${supplier_name} already exist`, function_name: 'supplierExist', date_started: systemDate, sql_action: "SELECT", event: "add supplier", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, supplier with name ${supplier_name} already exist`)
  }
  return next()


});
exports.brandExist = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { brand_name } = req.body

  const tableName = 'brands';
  const columnsToSelect = ['brand_id']; // Use string values for column names
  const conditions = [
    { column: 'brand_name', operator: '=', value: brand_name },
    { column: 'tenant_id', operator: '=', value: tenant_id },
  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]
  if (ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, brand with name ${brand_name} already exist`, function_name: 'brandExist', date_started: systemDate, sql_action: "SELECT", event: "add brand", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, brand with name ${brand_name} already exist`)
  }
  return next()


});
exports.catExist = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { category_name } = req.body

  const tableName = 'categories';
  const columnsToSelect = ['category_name']; // Use string values for column names
  const conditions = [
    { column: 'category_name', operator: '=', value: category_name },
    { column: 'tenant_id', operator: '=', value: tenant_id },
  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]
  if (ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, category with name ${category_name} already exist`, function_name: 'catExist', date_started: systemDate, sql_action: "SELECT", event: "add category", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, category with name ${category_name} already exist`)
  }
  return next()


});

//check if product exist for same tenant
exports.productExist = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { prod_name, serial } = req.body

  const findname = await ProductModel.checkExist('prod_name', prod_name, tenant_id)
  let ExistingInfo = findname.rows[0]

  const findserial = await ProductModel.checkExist('serial', serial, tenant_id)
  let ExistingSerial = findserial.rows[0]

  if (ExistingInfo || ExistingSerial) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product with same details already exist`, function_name: 'productExist', date_started: systemDate, sql_action: "SELECT", event: "Create Product", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, product with same details already exist`)
  }
  return next()


});
exports.findProduct = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { product_id } = req.body

  const findserial = await ProductModel.FindById(product_id, tenant_id)
  let ExistingSerial = findserial.rows[0]

  if (!ExistingSerial) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, product does not exist`)
  }
  req.product = ExistingSerial;
  return next()


});
exports.VerifyProductId = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { product_id } = req.body

  const findserial = await ProductModel.FindById(product_id, tenant_id)
  let ExistingSerial = findserial.rows[0]

  if (!ExistingSerial) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, product does not exist`)
  }
  req.product = ExistingSerial;
  return next()


});
exports.VerifyProductOptionValueId = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { product_option_value_id } = req.body

  const findserial = await ProductOptionValueModel.FindbyId(product_option_value_id)
  let ExistingSerial = findserial.rows[0]

  if (!ExistingSerial) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, product option value does not exist`)
  }
  req.productoptionval = ExistingSerial;
  return next()


});
exports.findExistingStock = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { product_id } = req.body

  if (product_id) {
    const product = await ProductModel.FindById(product_id, tenant_id)
    let ExistingProduct = product.rows[0]

    if (!ExistingProduct) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, `Sorry, product does not exist`)
    }
    req.product = ExistingProduct;
    return next()
  }

});
exports.findExistingBeforeSell = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let outlet_id = userData?.default_outlet_id
  let { items } = req.body
  let ExistingProduct = []



  let errorMessages = '';

  for (const iterator of items) {
    const product = await ProductModel.FindOutletProductById(iterator.product_id, tenant_id,outlet_id);
    let foundProduct = product.rows[0];
    let price = iterator?.price_type === 'wholesale' ? foundProduct?.wholesale_price : foundProduct?.prod_price;
    let prodQty = Number(foundProduct?.stock_quantity);
  console.log('====================================');
  console.log(prodQty);
  console.log('====================================');
    if (product.rowCount == 0) {
      errorMessages += 'Sorry, product does not exist. ';
    } else if (prodQty < iterator?.qty) {
      errorMessages += `Sorry, your stock is low on ${foundProduct?.prod_name}. `;
    } else {
      ExistingProduct.push(product.rows[0]);
  
      // Update the price in the item
      iterator.price = price;
    }
  }
  
  if (errorMessages) {
    // Handle errors and send the response if there are any error messages.
    // For example, you can return a response with status code 400 for bad requests.
    return sendResponse(res, 0, 400, errorMessages);
  }
  
  // If there are no errors, update the request body and proceed.
  req.body.items = items;
  req.product = ExistingProduct;
return next();
  

});
exports.findExistingBeforeTransfer = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { items } = req.body
  let ExistingProduct = []



  items = await Promise.all(items.map(async (iterator) => {
    const product = await ProductModel.FindById(iterator.product_id, tenant_id);
    let foundProduct = product.rows[0];
    let price = iterator?.price_type === 'wholesale' ? foundProduct?.wholesale_price : foundProduct?.prod_price;
    let prodQty = Number(foundProduct?.prod_qty);

    if (product.rowCount == 0) {
      CatchHistory({ api_response: `Sorry, product does not exist`, function_name: 'findExistingBeforeSell', date_started: systemDate, sql_action: "SELECT", event: "Customer purchasing a product", actor: userData.id }, req);
      return sendResponse(res, 0, 200, `Sorry, product does not exist`);
    }

    if (prodQty < iterator?.qty) {
      return sendResponse(res, 0, 200, `Sorry, your stock is low on ${foundProduct?.prod_name}`);
    }

    ExistingProduct.push(product.rows[0]);

    // Update the price in the item
    return { ...iterator, price };
  }));

  req.body.items = items;
  req.product = ExistingProduct;
  return next()

});
exports.findExistingBeforePickup = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let trasferData = req.transfer
  let { items } = req.body

  if (trasferData?.transfer_from === "warehouse") {
    //pick from warehouse

    console.log('====================================');
    console.log('picking from warehouse');
    console.log('====================================');
    for (const iterator of items) {
      const product = await ProductModel.FindById(iterator.product_id, tenant_id);
      let foundProduct = product.rows[0];
      let prodQty = Number(foundProduct?.prod_qty);

      if (product.rowCount == 0) {
        CatchHistory({ api_response: `Sorry, product does not exist`, function_name: 'findExistingBeforeSell', date_started: systemDate, sql_action: "SELECT", event: "Customer purchasing a product", actor: userData.id }, req);
        return sendResponse(res, 0, 200, `Sorry, product does not exist`);
      }

      if (prodQty < iterator?.qty) {
        return sendResponse(res, 0, 200, `Sorry, your stock is low on ${foundProduct?.prod_name}`);
      }
    }

    return next()
  }
  if (trasferData?.transfer_from === "outlet") {
    //pick from outlet
    console.log('====================================');
    console.log('picking from outlet');
    console.log('====================================');

    for (const iterator of items) {
      const product = await ProductModel.FindOutletProductById(iterator.product_id, tenant_id,trasferData?.source_outlet_id);
      let foundProduct = product.rows[0];
      let prodQty = Number(foundProduct?.stock_quantity);

      if (product.rowCount == 0) {
        CatchHistory({ api_response: `Sorry, product does not exist`, function_name: 'findExistingBeforeSell', date_started: systemDate, sql_action: "SELECT", event: "Customer purchasing a product", actor: userData.id }, req);
        return sendResponse(res, 0, 200, `Sorry, product does not exist`);
      }

      console.log('====================================');
      console.log(prodQty);
      console.log('====================================');
      if (prodQty < iterator?.qty) {
        return sendResponse(res, 0, 200, `Sorry, your stock is low on ${foundProduct?.prod_name}`);
      }
    }

    return next()
  
  }


});

exports.unPaidCreditOrder = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id
  let { order_id } = req.body

  const tableName = 'orders';
  const columnsToSelect = []; // Use string values for column names
  const conditions = [
    { column: 'order_id', operator: '=', value: order_id },
    { column: 'tenant_id', operator: '=', value: tenant_id },
    { column: 'status', operator: '=', value: 'pending' },
    { column: 'paid_status', operator: '=', value: 'unpaid' },
  ];
  let results = await Finder(tableName, columnsToSelect, conditions)
  let ObjectExist = results.rows[0]
  if (!ObjectExist) {
    CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, order with id ${order_id} does not exist`, function_name: 'unPaidCreditOrder', date_started: systemDate, sql_action: "SELECT", event: "view unpaid order for credit payment", actor: userData.id }, req)
    return sendResponse(res, 0, 200, `Sorry, order with id ${order_id} does not exist`)
  }

  req.order = ObjectExist
  return next()


});