const bcrypt = require("bcrypt");
const asynHandler = require("../../middleware/async");
const Model = require("../../model/Account")
const { sendResponse, sendCookie, clearResponse, CatchHistory, sendCustomerCookie, clearCustomerResponse } = require("../../helper/utilfunc");
const { FindDefaultShop } = require("../../model/Shop");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

// @desc Login controller
// @route POST /auth
// @access Public
exports.EcommerceCustomerAuth = asynHandler(async (req, res) => {
    const { username, password } = req.body

    //search for user in db
    const foundUser = await Model.CustomerAuth(username)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-username not in database", function_name: 'EcommerceCustomerAuth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }


    //is user active ?
    if (!UserDbInfo.is_active) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but not active", function_name: 'EcommerceCustomerAuth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //is user verified ?
    if (!UserDbInfo.is_verified) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but not verified", function_name: 'EcommerceCustomerAuth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //check for password
    const match = await bcrypt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but password does not match", function_name: 'EcommerceCustomerAuth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    delete  UserDbInfo.password
    CatchHistory({ payload: JSON.stringify({ username }), api_response: "User logged in", function_name: 'EcommerceCustomerAuth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
    return sendCustomerCookie(UserDbInfo, 1, 200, res, req)
})


exports.VerifyUser = asynHandler(async (req, res, next) => {
    let userData = req.user;
    CatchHistory({  api_response: "User is verified", function_name: 'VerifyUser', date_started: systemDate, sql_action: "SELECT", event: "Get User Info", actor: userData.id }, req)

    return sendResponse(res, 1, 200, "Loggedin", userData)
});


exports.Logout = asynHandler(async (req, res, next) => {
    CatchHistory({  api_response: "User is logged out", function_name: 'Logout', date_started: systemDate, sql_action: "SELECT", event: "Logout", actor: req.user.id }, req)
    return clearCustomerResponse(req, res)
});