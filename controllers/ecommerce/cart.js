const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ViewMyCart, deleteItemFromCart } = require("../../model/Cart");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateShoppingCart = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let {tenant_id,outlet_id} = req?.client
    let payload = req.body;
    payload.tenant_id = tenant_id
    payload.customer_id = userData?.customer_id
    payload.cart_status = 'loaded'
    let results = await GlobalModel.Create(payload, 'shopping_cart','');
    if (results.rowCount == 1) {
        CatchHistory({ api_response: `Customer with id ${userData?.id} added product with id ${payload.product_id} to  cart`, function_name: 'CreateShoppingCart', date_started: systemDate, sql_action: "INSERT", event: "ADD TO CART", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Item successfully added to cart", [])
    } else {
        CatchHistory({ api_response: `Sorry, error adding item to cart: contact administrator`, function_name: 'CreateShoppingCart', date_started: systemDate, sql_action: "INSERT", event: "ADD TO CART", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error adding item to cart: contact administrator", [])

    }

})
exports.ViewShoppingCart = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {tenant_id,outlet_id} = req?.client
    let results = await ViewMyCart(userData?.id,outlet_id,tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No item in cart", function_name: 'ViewShoppingCart', date_started: systemDate, sql_action: "SELECT", event: "VIEW MY CART", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No item in cart", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} from cart`, function_name: 'ViewShoppingCart', date_started: systemDate, sql_action: "SELECT", event: "VIEW MY CART", actor: userData.id }, req)

    sendResponse(res, 1, 200, `${results.rows.length} found in cart`, results.rows)
})
exports.DeleteShoppingCart = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {product_id} = req.body

    const runupdate = await deleteItemFromCart(product_id,userData?.customer_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} removed item with id ${product_id} from cart`, function_name: 'DeleteShoppingCart', date_started: systemDate, sql_action: "UPDATE", event: "REMOVE FROM CART", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Item removed from cart",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} removed item with id ${product_id} from cart`, function_name: 'DeleteShoppingCart', date_started: systemDate, sql_action: "UPDATE", event: "REMOVE FROM CART", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})