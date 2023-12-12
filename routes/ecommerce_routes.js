const express = require("express");
const router = express.Router();
const { userLogin } = require('../middleware/validator')
const { protect, protectCustomer } = require('../middleware/auth')

const { accountExist} = require('../middleware/isexist')
const { tenantExist } = require('../middleware/tenant')



//Customer CONTROLLER
const {
   EcommerceUserSignup,
} = require("../controllers/ecommerce/account");
const {
   UpdateCustomerProfile,
} = require("../controllers/ecommerce/profile");
const { protectOutlet } = require("../middleware/validate_api_keys");

//Customer AUTH CONTROLLER
const {
   EcommerceCustomerAuth, Logout, VerifyUser
} = require("../controllers/ecommerce/auth");
const { ViewEcommerceCategory } = require("../controllers/ecommerce/category");
const { ViewEcommerceProduct } = require("../controllers/ecommerce/product");

//routes
router.route("/ecommerce/signup").post(protectOutlet,EcommerceUserSignup);



//user login auth
router.route("/ecommerce/login").post(protectOutlet, EcommerceCustomerAuth);
 router.route("/ecommerce/auth").post(protectOutlet,protectCustomer, VerifyUser);
// router.route("/logout").post(protect, Logout);


//profile
router.route("/ecommerce/update_profile").post(protectOutlet,protectCustomer, UpdateCustomerProfile);

//category
router.route("/ecommerce/categories").post( ViewEcommerceCategory);

//products
router.route("/ecommerce/items").post( ViewEcommerceProduct);



module.exports = router;
