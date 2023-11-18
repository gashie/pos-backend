const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");


exports.UpdateCustomerProfile = asynHandler(async (req, res, next) => {
    let payload = req.body;
    let userData = req.user;
    payload.updated_at = systemDate

    let customerData = {

        "customer_id": payload.customer_id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "email": payload.email,
        "phone_number": payload.phone_number,
        "address_line1": payload.address_line1,
        "city": payload.city,
        "state_province": payload.state_province,
        "postal_code": payload.postal_code,
        "country": payload.country,
        "preferred_contact_method": payload.preferred_contact_method,
        "additional_info": payload.additional_info
        // Add other customer-related fields as needed

    }

    const runupdate = await GlobalModel.Update(customerData, 'customers', 'customer_id', payload.customer_id)
    if (runupdate.rowCount == 1) {
        CatchHistory({ api_response: `User with id :${userData.id} updated customer details`, function_name: 'UpdateCustomerProfile', date_started: systemDate, sql_action: "UPDATE", event: "Update Customer", actor: userData.id }, req)
        delete runupdate.rows[0].password
        delete runupdate.rows[0].is_verified
        delete runupdate.rows[0].is_active
        return sendResponse(res, 1, 200, "Record Updated", runupdate.rows[0])


    } else {
        CatchHistory({api_response: `Update failed, please try later-User with id :${userData.id} updated customer details`, function_name: 'UpdateCustomerProfile', date_started: systemDate, sql_action: "UPDATE", event: "Update Customer", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})