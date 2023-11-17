const asynHandler = require("../../middleware/async");
const bcyrpt = require("bcrypt");

const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { ShowTenantUsers } = require("../../model/Account");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");


exports.EcommerceUserSignup = asynHandler(async (req, res, next) => {
    //check if email,phone number,username exist
    //check if business name exist in the system
    let {tenant_id} = req?.client
    let { account } = req.body
    let accountData = {
        "username": account.username,
        "email": account.email,
        "phone_number": account.phone_number,
        "first_name": account.first_name,
        "last_name": account.last_name,
        "password": account.password,
        "is_verified": account.is_verified,
        "is_active": account.is_active,
        "address_line1": account.address_line1,
        "city": account.city,
        "state_province": account.state_province,
        "postal_code": account.postal_code,
        "country": account.country,
        preferred_contact_method: account.preferred_contact_method,
        additional_info: account.additional_info,
        tenant_id
    }
    const salt = await bcyrpt.genSalt(10);
    accountData.password = await bcyrpt.hash(account.password, salt);

    let results = await GlobalModel.Create(accountData, 'customers', 'customer_id');
    let accountSavedData = results.rows[0]
    if (results.rowCount == 1) {

        //save default address
        let addressPayload = {
            customer_id: accountSavedData.customer_id,
            street_address: account?.address_line1,
            is_default: true,
            city: account.city,
            postal_code: account.postal_code,
            country: account.country,

        }
        await GlobalModel.Create(addressPayload, 'ecommerce_addresses', '');
        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }


})
exports.UpdatEcommerceUser = asynHandler(async (req, res, next) => {
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
        "is_verified": account.is_verified,
        "is_active": account.is_active,
    }
    payload.updated_at = systemDate

    const runupdate = await GlobalModel.Update(payload, 'account', 'account_id', payload.account_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ api_response: `User with id :${userData.id} updated user details`, function_name: 'UpdateUser', date_started: systemDate, sql_action: "UPDATE", event: "Update User profile", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated", runupdate.rows[0])


    } else {
        CatchHistory({ api_response: `Update failed, please try later-User with id :${userData.id} updated user details`, function_name: 'UpdateUser', date_started: systemDate, sql_action: "UPDATE", event: "Update user profile", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})
exports.ViewEcommerceUser = asynHandler(async (req, res, next) => {
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
exports.PasswordReset = asynHandler(async (req, res, next) => {
    let user = req.user;
    let email = req.body.email;
    const salt = await bcyrpt.genSalt(10);
    let payload = req.body

    let newPayload = {
        password: await bcyrpt.hash(payload.password, salt),
        updatedAt: req.date,
        resetPeriod: null,
        resetToken: null
    }

    let result = await GlobalModel.Update('users', newPayload, 'userId', user.userId);

    if (result.affectedRows === 1) {
        CatchHistory({ api_response: `Password has been changed successfully for ${email}`, function_name: 'ActivateAccount', date_started: req.date, sql_action: "UPDATE", event: "User Account Activate", actor: email }, req)
        return sendResponse(res, 1, 200, 'Password has been changed successfully')

    } else {
        CatchHistory({ api_response: `Failed to update record or save new password for  :${email}`, function_name: 'ActivateAccount', date_started: req.date, sql_action: "UPDATE", event: "User Account Activate", actor: email }, req)
        return sendResponse(res, 0, 200, 'Failed to save new password, please try again later')
    }

})