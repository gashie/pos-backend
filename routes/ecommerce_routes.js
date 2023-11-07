const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect } = require('../middleware/auth')

const { accountExist} = require('../middleware/isexist')
const { tenantExist } = require('../middleware/tenant')



//TENANT CONTROLLER
const {
   EcommerceUserSignup, UpdatEcommerceUser
} = require("../controllers/ecommerce/account");

//TENANT AUTH CONTROLLER
// const {
//    Auth, Logout, VerifyUser
// } = require("../controllers/ecom/auth");

//routes
router.route("/signup").post(EcommerceUserSignup);



//user login auth
// router.route("/login").post(userLogin, Auth);
// router.route("/auth").post(protect, VerifyUser);
// router.route("/logout").post(protect, Logout);



module.exports = router;
