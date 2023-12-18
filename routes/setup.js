const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect } = require('../middleware/auth')

const { accountExist, alreadyAssigned, supplierExist, brandExist, catExist, productExist, findProduct, findExistingStock, findExistingBeforeSell, findOutlet, findTransfer, findExistingBeforePickup, findTransferNotApproved, unPaidCreditOrder, allowEcommerce, verifyMainBeforeSwitch } = require('../middleware/isexist')
const { tenantExist } = require('../middleware/tenant')



//TENANT CONTROLLER
const {
   TenantSignup, ViewTenantUsers, UserSignup, UpdateUser, ResetInAppPassword, PasswordReset
} = require("../controllers/pos/account");

//TENANT AUTH CONTROLLER
const {
   Auth, Logout, VerifyUser
} = require("../controllers/pos/auth");
//SHOP CONTROLLER
const { CreateShop, ViewTenantShops, UpdateShop, AssignToShop, CreateEcommerceShop, ViewTenantMainShop, SwitchMainOutlet } = require("../controllers/pos/shop");
const { CreateSupplier, UpdateSupplier, ViewTenantSupplier } = require("../controllers/pos/supplier");
const { CreateBrand, ViewTenantBrand, UpdateBrand } = require("../controllers/pos/brand");
const { CreateItemUnit, ViewItemUnit, UpdateItemUnit } = require("../controllers/pos/units");
const { CreateCategory, ViewTenantCategory, UpdateCategory } = require("../controllers/pos/category");
const { CreateCustomer, ViewTenantCustomers, UpdateCustomer } = require("../controllers/pos/customer");
//PRODUCT CONTROLLER
const {
   CreateProduct,
   ViewTenantProduct,
   UpdateProduct,
   SearchTenantProduct,
   FindTenantProduct,
   ViewTenantOutletProduct
   } = require("../controllers/pos/product");
const { ProdPicVerify, UpdateProdPicVerify } = require("../middleware/prodmiddleware");
const { CreateInventory, SearchInventory, ViewTenantInventory, UpdateInventory, ViewTenantInventoryHistory } = require("../controllers/pos/inventory");
const { CreateOrder, ViewGeneralOrderByDate, ViewCreditOrderByDate, PayCredit } = require("../controllers/pos/order");
const { SendStockToOutlet, ViewStockTransfer, CancelTransfer, PickUpConsignment, ReceiveConsignment, ViewStocksForTransfer, ViewStocksPickedForTransfer } = require("../controllers/pos/outlet_stock_transfer");
const { CreateIncomeCategory, ViewTenantIncomeCategory, UpdateIncomeCategory, AddIncomeData, ViewTenantIncomeData, UpdateIncomeData } = require("../controllers/pos/income");
const { CreateExpensesCategory, ViewTenantExpensesCategory, UpdateExpenseCategory, AddExpenseData, ViewTenantExpenseData, UpdateExpenseData } = require("../controllers/pos/expenses");
const { IncomeAndExpenseReport, ProductReport, SalesByCategory, SalesAndProfitCharges, ViewEmployeePerformance, ViewProfitMargins, ViewOverheadExpenses, ViewReorderReport, ViewReorderReportByOutlet, ViewProfitPerOutlet, OutletInventoryReport } = require("../controllers/pos/report");
const { CreateBank, ViewBanks, UpdateBank } = require("../controllers/pos/banks");
const { CreateBankAccount, ViewBankAccount, UpdateBankAccount } = require("../controllers/pos/bank_account");
const { CreateGroupBand, ViewGroupBand, UpdateGroupBand } = require("../controllers/pos/group_band");
const { AssignUserGroupBand, ViewUserAssignedGroupBands, UpdateAssignedGroupBand } = require("../controllers/pos/user_group_band");
const { CreateSalaryAllowance, ViewSalaryAllowance, UpdateSalaryAllowance } = require("../controllers/pos/salary_allowance");
const { CreateSalaryDeduction, ViewSalaryDeduction, UpdateSalaryDeduction } = require("../controllers/pos/salary_deduction");
const { CreateSalaryBandAllowance, ViewSalaryBandAllowance, UpdateSalaryBandAllowance } = require("../controllers/pos/salary_band_allowance");
const { CreateSalaryBandDeduction, ViewSalaryBandDeduction, UpdateSalaryBandDeduction } = require("../controllers/pos/salary_band_deduction");
const { CreateParentLocation, CreateSubLocation, ViewLocation, ViewSubLocation, UpdateLocation, ViewCascadedLocation } = require("../controllers/pos/location");
const { CreateShippingCarrier, ViewShippingCarrier, UpdateShippingCarrier } = require("../controllers/pos/shipping_carrier");
const { CreatePickupPoint, ViewPickUpPoint, UpdatePickUpPoint } = require("../controllers/pos/pickup_points");
const { CreateSystemRole, ViewSystemRole, UpdateSystemRole, CreateUserRole, ViewUserRole } = require("../controllers/pos/system_roles");
const { CreateSystemPermission, ViewSystemPermission, UpdateSystemPermission, CreateRolePermission, ViewRolePermission } = require("../controllers/pos/system_permission");
const { RunPayRoll } = require("../controllers/pos/paryroll_run");


//routes
router.route("/tenantsignup").post(accountExist, tenantExist, TenantSignup);
router.route("/viewusers").post(protect,ViewTenantUsers);
router.route("/createuser").post(protect,UserSignup);
router.route("/updateuser").post(protect,UpdateUser);
router.route("/resetinapppassword").post(protect,PasswordReset);

///roles
router.route("/create_role").post(protect,CreateSystemRole);
router.route("/create_user_role").post(protect,CreateUserRole);
router.route("/view_user_role").post(protect,ViewUserRole);
router.route("/view_role").post(protect,ViewSystemRole);
router.route("/update_role").post(protect,UpdateSystemRole);
//permission
router.route("/create_permission").post(protect,CreateSystemPermission);
router.route("/create_role_permission").post(protect,CreateRolePermission);
router.route("/view_role_permission").post(protect,ViewRolePermission);
router.route("/view_permission").post(protect,ViewSystemPermission);
router.route("/update_permission").post(protect,UpdateSystemPermission);

///routes
router.route("/create_route").post(protect,CreateSystemRole);
router.route("/view_route").post(protect,CreateSystemRole);
router.route("/update_route").post(protect,CreateSystemRole);


//user login auth
router.route("/login").post(userLogin, Auth);
router.route("/auth").post(protect, VerifyUser);
router.route("/logout").post(protect, Logout);


//shops
router.route("/addshop").post(protect,CreateShop);
router.route("/addecommerce").post(protect,allowEcommerce,CreateEcommerceShop);
router.route("/assigntoshop").post(protect,alreadyAssigned,AssignToShop);
router.route("/viewshops").post(protect, ViewTenantShops);
router.route("/switch_outlet_view").post(protect, ViewTenantMainShop);
router.route("/switch_outlet_setup").post(protect,verifyMainBeforeSwitch, SwitchMainOutlet);
router.route("/updateshop").post(protect, UpdateShop);

//supplier
router.route("/addsupplier").post(protect,supplierExist, CreateSupplier);
router.route("/viewsupplier").post(protect, ViewTenantSupplier);
router.route("/updatesupplier").post(protect, UpdateSupplier);

//brands
router.route("/addbrand").post(protect,brandExist, CreateBrand);
router.route("/viewbrands").post(protect, ViewTenantBrand);
router.route("/updatebrand").post(protect, UpdateBrand);

//unit

router.route("/addunit").post(protect,CreateItemUnit);
router.route("/viewunit").post(protect, ViewItemUnit);
router.route("/updateunit").post(protect, UpdateItemUnit);

//category
router.route("/addcategory").post(protect,catExist, CreateCategory);
router.route("/viewcategory").post(protect, ViewTenantCategory);
router.route("/updatecategory").post(protect, UpdateCategory);

//customers
router.route("/addcustomer").post(protect, CreateCustomer);
router.route("/viewcustomer").post(protect, ViewTenantCustomers);
router.route("/updatecustomer").post(protect, UpdateCustomer);

//product
router.route("/addproduct").post(protect,productExist,ProdPicVerify, CreateProduct);
router.route("/viewproduct").post(protect, ViewTenantProduct);
router.route("/viewoutletproduct").post(protect, ViewTenantOutletProduct);
router.route("/updateproduct").post(protect,findProduct,UpdateProdPicVerify, UpdateProduct);
router.route("/searchproduct").post(protect, SearchTenantProduct);
router.route("/findproduct").post(protect, FindTenantProduct);

//product invetory routes
router.route("/addinventory").post(protect,findExistingStock,CreateInventory);
router.route("/searchinventory").post(protect, SearchInventory);
router.route("/viewinventory").post(protect, ViewTenantInventory);
router.route("/viewinventoryhistory").post(protect, ViewTenantInventoryHistory);
router.route("/updateinventory").post(protect,findExistingStock, UpdateInventory);


//transfer stocks  routes
router.route("/initiatetransfer").post(protect,findOutlet,SendStockToOutlet);
router.route("/viewtransfer").post(protect,ViewStockTransfer);
router.route("/viewtconsignmentitems").post(protect,ViewStocksPickedForTransfer);
router.route("/deletetransfer").post(protect,CancelTransfer);
router.route("/pickupconsignment").post(protect,findTransfer,findExistingBeforePickup,PickUpConsignment);
router.route("/receiveconsignment").post(protect,findTransferNotApproved,ReceiveConsignment);
router.route("/viewstockfortransfer").post(protect,findTransfer,ViewStocksForTransfer);

//income category
router.route("/addincomecategory").post(protect,CreateIncomeCategory);
router.route("/viewincomecategory").post(protect,ViewTenantIncomeCategory);
router.route("/updateincomecategory").post(protect,UpdateIncomeCategory);
//expense category
router.route("/addincome").post(protect,AddIncomeData);
router.route("/viewincome").post(protect,ViewTenantIncomeData);
router.route("/updateincome").post(protect,UpdateIncomeData);


//expense category
router.route("/addexpensecategory").post(protect,CreateExpensesCategory);
router.route("/viewexpensecategory").post(protect,ViewTenantExpensesCategory);
router.route("/updateexpensecategory").post(protect,UpdateExpenseCategory);
//expense category
router.route("/addexpense").post(protect,AddExpenseData);
router.route("/viewexpense").post(protect,ViewTenantExpenseData);
router.route("/updateexpense").post(protect,UpdateExpenseData);

//report
router.route("/incomexpensereport").post(protect,IncomeAndExpenseReport);
router.route("/productreport").post(protect,ProductReport);
router.route("/outletinventoryreport").post(protect,OutletInventoryReport);
router.route("/viewsalesbycategory").post(protect,SalesByCategory);
router.route("/viewsalesandprofitcharges").post(protect,SalesAndProfitCharges);
router.route("/viewemployeeperformance").post(protect,ViewEmployeePerformance);
router.route("/vieweprofitmargins").post(protect,ViewProfitMargins);
router.route("/viewoverheadexpenses").post(protect,ViewOverheadExpenses);
router.route("/viewereoder").post(protect,ViewReorderReport);
router.route("/viewereoderbyoutlet").post(protect,ViewReorderReportByOutlet);
router.route("/viewprofitforoutlet").post(protect,ViewProfitPerOutlet);


//locations
router.route("/add_parent_location").post(protect,CreateParentLocation);
router.route("/add_sub_location").post(protect,CreateSubLocation);
router.route("/view_locations").post(protect,ViewLocation);
router.route("/view_sub_locations").post(protect,ViewSubLocation);
router.route("/view_cascaded_locations").post(protect,ViewCascadedLocation);
router.route("/update_location").post(protect,UpdateLocation);




//shipping carriers and shipping rate start here
router.route("/add_shipping_carrier").post(protect,CreateShippingCarrier);
router.route("/view_shipping_carrier").post(protect,ViewShippingCarrier);
router.route("/update_shipping_carrier").post(protect,UpdateShippingCarrier);
//**shiping rate */
router.route("/add_shipping_rate").post(protect,CreateShippingCarrier);
router.route("/view_shipping_rate").post(protect,ViewShippingCarrier);
router.route("/update_shipping_rate").post(protect,UpdateShippingCarrier);
//**shiping rate */
router.route("/add_pickup_point").post(protect,CreatePickupPoint);
router.route("/view_pickup_point").post(protect,ViewPickUpPoint);
router.route("/update_pickup_point").post(protect,UpdatePickUpPoint);


//shipping carriers* ends here

//***PAYROLL**/

//manage bank
router.route("/add_bank").post(protect,CreateBank);
router.route("/view_banks").post(protect,ViewBanks);
router.route("/update_bank").post(protect,UpdateBank);

//manage bank account
router.route("/add_bankaccount").post(protect,CreateBankAccount);
router.route("/view_bankaccount").post(protect,ViewBankAccount);
router.route("/update_bankaccount").post(protect,UpdateBankAccount);


//manage group band
router.route("/add_groupband").post(protect,CreateGroupBand);
router.route("/view_groupband").post(protect,ViewGroupBand);
router.route("/update_groupband").post(protect,UpdateGroupBand);

//manage user assigned band
router.route("/assigntoband").post(protect,AssignUserGroupBand);
 router.route("/view_assignedgroupband").post(protect,ViewUserAssignedGroupBands);
router.route("/update_assignedgroupband").post(protect,UpdateAssignedGroupBand);


//manage salary allowance
router.route("/createallowance").post(protect,CreateSalaryAllowance);
 router.route("/view_allowance").post(protect,ViewSalaryAllowance);
router.route("/update_allowance").post(protect,UpdateSalaryAllowance);

//manage salary deduction
router.route("/creatededuction").post(protect,CreateSalaryDeduction);
 router.route("/view_deduction").post(protect,ViewSalaryDeduction);
router.route("/update_deduction").post(protect,UpdateSalaryDeduction);


//manage salary band allowance
router.route("/create_bandallowance").post(protect,CreateSalaryBandAllowance);
 router.route("/view_bandallowance").post(protect,ViewSalaryBandAllowance);
router.route("/update_bandallowance").post(protect,UpdateSalaryBandAllowance);


//manage salary band deduction
router.route("/create_banddeduction").post(protect,CreateSalaryBandDeduction);
 router.route("/view_banddeduction").post(protect,ViewSalaryBandDeduction);
router.route("/update_banddeduction").post(protect,UpdateSalaryBandDeduction);

//run payroll
router.route("/start_payroll").post(protect,RunPayRoll);


//***PAYROLL**/

//order  routes
router.route("/sell").post(protect,findExistingBeforeSell,CreateOrder);
router.route("/sales").post(protect,ViewGeneralOrderByDate);
router.route("/credit_history").post(protect,ViewCreditOrderByDate);
router.route("/pay_credit").post(protect,unPaidCreditOrder,PayCredit);

module.exports = router;
