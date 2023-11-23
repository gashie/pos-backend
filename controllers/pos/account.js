const asynHandler = require("../../middleware/async");
const bcyrpt = require("bcrypt");
const Model = require("../../model/Account")
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ShowTenantUsers } = require("../../model/Account");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.TenantSignup = asynHandler(async (req, res, next) => {
    //check if email,phone number,username exist
    //check if business name exist in the system
    let { tenant, account } = req.body
    let tenantPayload = tenant
    let business = tenant?.tenant_name.replace(/\s/g, "")
    tenantPayload.url = `${business?.toLowerCase()}.gashie.net`
    let tenantresult = await GlobalModel.Create(tenantPayload, 'tenants', 'tenant_id');
    let tenantSavedData = tenantresult.rows[0]
    let shopPayload =
    {
        "outlet_name": `${tenant?.tenant_name} main outlet`,
        "tenant_id": tenantSavedData.tenant_id,
        "is_main_outlet": true,
        "outlet_description": `${tenant?.tenant_name} first outlet`,
        "outlet_address_line1": `${tenant?.address_line1}`,
        "outlet_city": `${tenant?.city}`,
        "outlet_country": `${tenant?.country}`,
        "outlet_phone": `${tenant?.contact_phone}`,
        "outlet_email": `${tenant?.contact_email}`,
        "opening_hours": "Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM",
        "website_url": tenantPayload.url,
    }

    let shopresult = await GlobalModel.Create(shopPayload, 'outlet', 'outlet_id');
    let shopSavedData = shopresult.rows[0]
    let accountData = account
    accountData.tenant_id = tenantSavedData.tenant_id
    const salt = await bcyrpt.genSalt(10);
    accountData.password = await bcyrpt.hash(account.password, salt);
    accountData.role = "Manager"
    if (tenantresult.rowCount == 1 && shopresult.rowCount == 1) {
        let results = await GlobalModel.Create(accountData, 'account', 'account_id');
        let accountSavedData = results.rows[0]
        if (results.rowCount == 1) {
            let shopAssigned = {
                outlet_id: shopSavedData.outlet_id,
                user_id: accountSavedData.account_id,
                role: "Admin",
                is_default: true,

            }
            await GlobalModel.Create(shopAssigned, 'shop_user_access', '');
            return sendResponse(res, 1, 200, "Record saved", [])
        } else {
            return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

        }

    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})
exports.UserSignup = asynHandler(async (req, res, next) => {
    //check if email,phone number,username exist
    //check if business name exist in the system
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let { account } = req.body
    let accountData = {
        "username": account.username,
        "email": account.email,
        "phone": account.phone,
        "first_name": account.first_name,
        "last_name": account.last_name,
        "password": account.password,
        "is_verified": account.is_verified,
        "is_active": account.is_active,
        "role": account?.role,
        tenant_id
    }
    const salt = await bcyrpt.genSalt(10);
    accountData.password = await bcyrpt.hash(account.password, salt);

    let results = await GlobalModel.Create(accountData, 'account', 'account_id');
    let accountSavedData = results.rows[0]
    if (results.rowCount == 1) {
        let shopAssigned = {
            outlet_id: account.outlet_id,
            user_id: accountSavedData.account_id,
            role: account?.role,
            is_default: account?.is_default,

        }
        await GlobalModel.Create(shopAssigned, 'shop_user_access', '');
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


})
exports.UpdateUser = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let { account } = req.body

    let payload = {
        "account_id": account.account_id,
        "username": account.username,
        "email": account.email,
        "phone": account.phone,
        "role": account.role,
        "first_name": account.first_name,
        "last_name": account.last_name,
    }
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'account', 'account_id', payload.account_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ api_response: `User with id :${userData.id} updated user details`, function_name: 'UpdateUser', date_started: systemDate, sql_action: "UPDATE", event: "Update User profile", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ api_response: `Update failed, please try later-User with id :${userData.id} updated user details`, function_name: 'UpdateUser', date_started: systemDate, sql_action: "UPDATE", event: "Update user profile", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})

exports.PasswordReset = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let {email,account_id} = req.body;
    const salt = await bcyrpt.genSalt(10);


    let payload = {
        password: await bcyrpt.hash(req.body.password, salt),
        updated_at: systemDate,
    }


    const runupdate = await GlobalModel.Update(payload, 'account', 'account_id', account_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ api_response: `User with id :${userData.id} updated user password`, function_name: 'PasswordReset', date_started: systemDate, sql_action: "UPDATE", event: "Update User password", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ api_response: `Update failed, please try later-User with id :${userData.id} updated user password`, function_name: 'PasswordReset', date_started: systemDate, sql_action: "UPDATE", event: "Update user password", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }

})

exports.ResetInAppPassword = asynHandler(async (req, res) => {
    let userData = req.user.userInfo;
    const { password, newPassword,account_id } = req.body

    const foundUser = await Model.auth(username)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-username not in database", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }




    //check for password
    const match = await bcyrpt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ payload: JSON.stringify({ username }), api_response: "Unauthorized access-user exist but password does not match", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: username }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }
    const salt = await bcyrpt.genSalt(10);

    let newPayload = {
        password: await bcyrpt.hash(newPassword, salt),
        updated_at: systemDate,
    }

    const runupdate = await GlobalModel.Update(newPayload, 'account', 'account_id', account_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ api_response: `User with id :${userData.id} updated user password`, function_name: 'PasswordReset', date_started: systemDate, sql_action: "UPDATE", event: "Update User password", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])


    } else {
        CatchHistory({ api_response: `Update failed, please try later-User with id :${userData.id} updated user password`, function_name: 'PasswordReset', date_started: systemDate, sql_action: "UPDATE", event: "Update user password", actor: userData.id }, req)
       
    }
})
exports.ViewTenantUsers = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let results = await ShowTenantUsers(tenant_id);
    if (results.rows.length == 0) {
        CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantUsers', date_started: systemDate, sql_action: "SELECT", event: `View all users for tenant with id ${tenant_id}`, actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} users record's`, function_name: 'ViewTenantUsers', date_started: systemDate, sql_action: "SELECT", event: `View all users for tenant with id ${tenant_id}`, actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})