const bcrypt = require("bcrypt");
const asynHandler = require("../../middleware/async");
const Model = require("../../model/Account")
const { sendResponse, sendCookie, clearResponse, CatchHistory } = require("../../helper/utilfunc");
const { FindDefaultShop } = require("../../model/Shop");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

// @desc Login controller
// @route POST /auth
// @access Public
exports.Auth = asynHandler(async (req, res) => {
    const { username, password } = req.body

    //search for user in db
    const foundUser = await Model.auth(username)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-username not in database", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }


    //is user active ?
    if (!UserDbInfo.is_active) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but not active", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //is user verified ?
    if (!UserDbInfo.is_verified) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but not verified", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    //check for password
    const match = await bcrypt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but password does not match", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }

    const findmyshop = await FindDefaultShop(UserDbInfo.user_id)
    let UserInfo = {
        id: UserDbInfo.user_id,
        tenant_id: UserDbInfo.tenant_id,
        company:UserDbInfo.tenant_name,
        username: UserDbInfo.username,
        name: UserDbInfo.first_name + ' ' + UserDbInfo.last_name,
        email: UserDbInfo.email,
        role: UserDbInfo.role,
        default_outlet_id:findmyshop.rows[0].outlet_id,
        default_role:findmyshop.rows[0].role,
        subscription_type:UserDbInfo.subscription_type,
        has_electronic:UserDbInfo.has_electronic

    }

    console.log(UserInfo);
    CatchHistory({ payload: JSON.stringify({ username }), api_response: "User logged in", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
    return sendCookie(UserInfo, 1, 200, res, req)
})


exports.VerifyUser = asynHandler(async (req, res, next) => {
    let userData = req.user;
    CatchHistory({  api_response: "User is verified", function_name: 'VerifyUser', date_started: systemDate, sql_action: "SELECT", event: "Get User Info", actor: userData.id }, req)

    return sendResponse(res, 1, 200, "Loggedin", userData)
});


exports.Logout = asynHandler(async (req, res, next) => {
    CatchHistory({  api_response: "User is logged out", function_name: 'Logout', date_started: systemDate, sql_action: "SELECT", event: "Logout", actor: req.user.id }, req)
    return clearResponse(req, res)
});