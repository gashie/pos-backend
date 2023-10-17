const asynHandler = require("../middleware/async");
const bcyrpt = require("bcrypt");

const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")

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
        "shop_name": `${tenant?.tenant_name} main shop`,
        "tenant_id": tenantSavedData.tenant_id,
        "is_main_shop": true,
        "shop_description": `${tenant?.tenant_name} first shop`,
        "shop_address_line1": `${tenant?.address_line1}`,
        "shop_city": `${tenant?.city}`,
        "shop_country": `${tenant?.country}`,
        "shop_phone": `${tenant?.contact_phone}`,
        "shop_email": `${tenant?.contact_email}`,
        "opening_hours": "Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM",
        "website_url": tenantPayload.url,
    }

    let shopresult = await GlobalModel.Create(shopPayload, 'shops', 'shop_id');
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
                shop_id:shopSavedData.shop_id,
                user_id:accountSavedData.account_id,
                role:"Admin",
                is_default: true,
                
            }
            let savingshopassigned = await GlobalModel.Create(shopAssigned, 'shop_user_access', '');
            return sendResponse(res, 1, 200, "Record saved", [])
        } else {
            return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

        }

    } else {
        return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})