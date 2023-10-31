const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect } = require('../middleware/auth')

const { accountExist, alreadyAssigned, supplierExist, brandExist, catExist, productExist, findProduct, findExistingStock, findExistingBeforeSell, findOutlet, findTransfer, findExistingBeforePickup, findTransferNotApproved, unPaidCreditOrder } = require('../middleware/isexist')
const { tenantExist } = require('../middleware/tenant')



//TENANT CONTROLLER
const {
   TenantSignup, ViewTenantUsers, UserSignup, UpdateUser
} = require("../controllers/account");

//TENANT AUTH CONTROLLER
const {
   Auth, Logout, VerifyUser
} = require("../controllers/auth");
//SHOP CONTROLLER
const { CreateShop, ViewTenantShops, UpdateShop, AssignToShop } = require("../controllers/shop");
const { CreateSupplier, UpdateSupplier, ViewTenantSupplier } = require("../controllers/supplier");
const { CreateBrand, ViewTenantBrand, UpdateBrand } = require("../controllers/brand");
const { CreateItemUnit, ViewItemUnit, UpdateItemUnit } = require("../controllers/units");
const { CreateCategory, ViewTenantCategory, UpdateCategory } = require("../controllers/category");
const { CreateCustomer, ViewTenantCustomers, UpdateCustomer } = require("../controllers/customer");
//PRODUCT CONTROLLER
const {
   CreateProduct,
   ViewTenantProduct,
   UpdateProduct,
   SearchTenantProduct,
   FindTenantProduct,
   ViewTenantOutletProduct
   } = require("../controllers/product");
const { ProdPicVerify, UpdateProdPicVerify } = require("../middleware/prodmiddleware");
const { CreateInventory, SearchInventory, ViewTenantInventory, UpdateInventory, ViewTenantInventoryHistory } = require("../controllers/inventory");
const { CreateOrder, ViewGeneralOrderByDate, ViewCreditOrderByDate, PayCredit } = require("../controllers/order");
const { SendStockToOutlet, ViewStockTransfer, CancelTransfer, PickUpConsignment, ReceiveConsignment, ViewStocksForTransfer, ViewStocksPickedForTransfer } = require("../controllers/outlet_stock_transfer");
const { CreateIncomeCategory, ViewTenantIncomeCategory, UpdateIncomeCategory, AddIncomeData, ViewTenantIncomeData, UpdateIncomeData } = require("../controllers/income");
const { CreateExpensesCategory, ViewTenantExpensesCategory, UpdateExpenseCategory, AddExpenseData, ViewTenantExpenseData, UpdateExpenseData } = require("../controllers/expenses");


//routes
router.route("/tenantsignup").post(accountExist, tenantExist, TenantSignup);
router.route("/viewusers").post(protect,ViewTenantUsers);
router.route("/createuser").post(protect,UserSignup);
router.route("/updateuser").post(protect,UpdateUser);



//user login auth
router.route("/login").post(userLogin, Auth);
router.route("/auth").post(protect, VerifyUser);
router.route("/logout").post(protect, Logout);


//shops
router.route("/addshop").post(protect,CreateShop);
router.route("/assigntoshop").post(protect,alreadyAssigned,AssignToShop);
router.route("/viewshops").post(protect, ViewTenantShops);
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

//order  routes
router.route("/sell").post(protect,findExistingBeforeSell,CreateOrder);
router.route("/sales").post(protect,ViewGeneralOrderByDate);
router.route("/credit_history").post(protect,ViewCreditOrderByDate);
router.route("/pay_credit").post(protect,unPaidCreditOrder,PayCredit);

module.exports = router;
