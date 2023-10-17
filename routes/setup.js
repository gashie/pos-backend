const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect } = require('../middleware/auth')

const { accountExist, alreadyAssigned } = require('../middleware/isexist')
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

module.exports = router;
