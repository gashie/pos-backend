const uuidV4 = require('uuid');
const asynHandler = require("./async");
let path = require('path')
const dotenv = require("dotenv");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");



exports.ProdPicVerify = asynHandler(async (req, res, next) => {
    let pic = req?.files?.prod_pic;
    let imageId = uuidV4.v4();
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let {serial,prod_name,net_image} = req.body
    let ProdPic = 'tenant';
    var prodPicUploadLink = "./upload/images/products/";
    //Set History Parameters
  
    //save Base64 to file
    fs = require('fs');
    //check files for
    // if (net_image.length > 0 ) {
    //   return   next()
    // }
    if (!pic) {
      return sendResponse(res, 0, 401, 'Please upload an image file for the product')
    }
    if (!pic.mimetype.startsWith("image")) {
     CatchHistory({ api_response: `User with ${user_id} uploaded a file with no image extension for product`, function_name: 'ProdPicVerify', date_started: systemDate, sql_action: "SELECT", event: "Add new product", actor: user_id }, req)
     return sendResponse(res, 0, 401, 'Please upload an image file for the product')
    }

    //save images
    //change filename

    pic.name = `${ProdPic}-${tenant_id}-serail-${imageId}${path.parse(pic.name).ext}`;
    console.log(`${ProdPic}-${tenant_id}-serial-${imageId}${path.parse(pic.name).ext}`);
    if (!fs.existsSync(`${prodPicUploadLink}${pic.name}`)) {
      console.log('file does not exist, saving product...');
      pic.mv(`${prodPicUploadLink}${pic.name}`, async (err) => {
        if (err) {
          console.log(err);
          return sendResponse(res, 0, 500, 'Image upload failed')
  
        }
      });
    }
 
  
    next()
  })

  exports.UpdateProdPicVerify = asynHandler(async (req, res, next) => {
    let pic = req?.files?.prod_pic;
    let imageId = uuidV4.v4();
    // let {net_image} = req.body
    // if (net_image.length > 0 ) {
    //   return   next()
    // }
   if (pic) {
    console.log('im doing something here');
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let {serial,prod_name} = req.body
    let ProdPic = 'tenant';
    var prodPicUploadLink = "./upload/images/products/";

    //Set History Parameters
  
    //save Base64 to file
    fs = require('fs');
    //check files for
    if (!pic.mimetype.startsWith("image")) {
     CatchHistory({api_response: `User with ${user_id} uploaded a file with no image extension for product`, function_name: 'ProdPicVerify', date_started: systemDate, sql_action: "SELECT", event: "Add new product", actor: user_id }, req)
     return sendResponse(res, 0, 401, 'Please upload an image file for the product')
    }

    //save images
    //change filename

    pic.name = `${ProdPic}-${tenant_id}-serail-${imageId}${path.parse(pic.name).ext}`;
    console.log(`${ProdPic}-${tenant_id}-serial-${imageId}${path.parse(pic.name).ext}`);
    if (!fs.existsSync(`${prodPicUploadLink}${pic.name}`)) {
      console.log('file does not exist, saving product...');
      pic.mv(`${prodPicUploadLink}${pic.name}`, async (err) => {
        if (err) {
          console.log(err);
          return sendResponse(res, 0, 500, 'Image upload failed')
  
        }
      });
    }
 
   }
    next()
  })