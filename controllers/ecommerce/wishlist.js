const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ViewMyWishlist, deleteItemFromWishList } = require("../../model/Wishlist");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.CreateShoppingWishList = asynHandler(async (req, res, next) => {
    //check if supplier exist for tenant
    let userData = req.user;
    let {tenant_id,outlet_id} = req?.client
    let payload = req.body;
    payload.tenant_id = tenant_id
    payload.customer_id = userData?.customer_id
    payload.wishlist_status = 'liked'
    let results = await GlobalModel.Create(payload, 'wishlist','');
    if (results.rowCount == 1) {
        CatchHistory({ api_response: `Customer with id ${userData?.id} added product with id ${payload.product_id} to  wishlist`, function_name: 'CreateShoppingWishList', date_started: systemDate, sql_action: "INSERT", event: "ADD TO WISHLIST", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Item successfully added to wishlist", [])
    } else {
        CatchHistory({ api_response: `Sorry, error adding item to wishlist: contact administrator`, function_name: 'CreateShoppingWishList', date_started: systemDate, sql_action: "INSERT", event: "ADD TO WISHLIST", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, error adding item to wishlist: contact administrator", [])

    }

})
exports.ViewShoppingWishList = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {tenant_id,outlet_id} = req?.client
    let results = await ViewMyWishlist(userData?.id,outlet_id,tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No item in wishlist", function_name: 'ViewShoppingWishList', date_started: systemDate, sql_action: "SELECT", event: "VIEW MY WISHLIST", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No item in wishlist", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} from wishlist`, function_name: 'ViewShoppingWishList', date_started: systemDate, sql_action: "SELECT", event: "VIEW MY WISHLIST", actor: userData.id }, req)

    sendResponse(res, 1, 200, `${results.rows.length} found in wishlist`, results.rows)
})
exports.DeleteShoppingWishList = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {product_id} = req.body

    const runupdate = await deleteItemFromWishList(product_id,userData?.id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${userData.id} removed item with id ${product_id} from wishlist`, function_name: 'DeleteShoppingWishList', date_started: systemDate, sql_action: "DELETE", event: "REMOVE FROM WISHLIST", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Item removed from wishlist",runupdate.rows[0])


    } else {
        CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${userData.id} removed item with id ${product_id} from wishlist`, function_name: 'DeleteShoppingWishList', date_started: systemDate, sql_action: "DELETE", event: "REMOVE FROM WISHLIST", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})