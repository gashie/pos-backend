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
  let { shop_id, user_id, role } = req.body

  const tableName = 'shop_user_access';
  const columnsToSelect = ['user_id', 'shop_id', 'role']; // Use string values for column names
  const conditions = [
    { column: 'user_id', operator: '=', value: user_id },
    { column: 'shop_id', operator: '=', value: shop_id },
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
  let { product_option_value_id, product_id } = req.body
  let plenth = product_id.length
  let pvalength = product_option_value_id.length
  if (plenth > 0 && pvalength > 0) {
    const findoptionval = await ProductOptionValueModel.FindbyId(product_option_value_id)
    let ExistingOPtionValue = findoptionval.rows[0]
    if (!ExistingOPtionValue) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, `Sorry, product option value does not exist`)
    }
    const product = await ProductModel.FindById(product_id, tenant_id)
    let ExistingProduct = product.rows[0]

    if (!ExistingProduct) {
      CatchHistory({ payload: JSON.stringify(req.body), api_response: `Sorry, product does not exist`, function_name: 'findProduct', date_started: systemDate, sql_action: "SELECT", event: "Update Product", actor: userData.id }, req)
      return sendResponse(res, 0, 200, `Sorry, product does not exist`)
    }
    req.product = ExistingProduct;
    req.productoptionval = ExistingOPtionValue;
    return next()
  }

  if (plenth > 0 && pvalength === 0) {
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