const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect } = require('../middleware/auth')

const { accountExist, alreadyAssigned, supplierExist, brandExist, catExist, productExist, findProduct, findExistingStock } = require('../middleware/isexist')
const { tenantExist } = require('../middleware/tenant')



//TENANT CONTROLLER
const {
   TenantSignup
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
   FindTenantProduct
   } = require("../controllers/product");
const { ProdPicVerify, UpdateProdPicVerify } = require("../middleware/prodmiddleware");
const { CreateInventory, SearchInventory, ViewTenantInventory, UpdateInventory, ViewTenantInventoryHistory } = require("../controllers/inventory");


//routes
router.route("/tenantsignup").post(accountExist, tenantExist, TenantSignup);



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
router.route("/updateproduct").post(protect,findProduct,UpdateProdPicVerify, UpdateProduct);
router.route("/searchproduct").post(protect, SearchTenantProduct);
router.route("/findproduct").post(protect, FindTenantProduct);

//product invetory routes
router.route("/addinventory").post(protect,findExistingStock,CreateInventory);
router.route("/searchinventory").post(protect, SearchInventory);
router.route("/viewinventory").post(protect, ViewTenantInventory);
router.route("/viewinventoryhistory").post(protect, ViewTenantInventoryHistory);
router.route("/updateinventory").post(protect,findExistingStock, UpdateInventory);
module.exports = router;
