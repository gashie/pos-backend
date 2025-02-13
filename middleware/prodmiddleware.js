const uuidV4 = require('uuid');
const asynHandler = require("./async");
let path = require('path')
const dotenv = require("dotenv");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const fs = require('fs');

let prodPicUploadLink = "./upload/images/products/";


exports.ProdPicVerify = asynHandler(async (req, res, next) => {
  let pic = req?.files?.prod_pic; // Access the file from req.files
  let imageId = uuidV4.v4(); // Generate a unique image ID
  let userData = req.user;
  let tenant_id = userData?.tenant_id; // Get the tenant_id from userData
  let { serial, prod_name, net_image } = req.body; // Destructure req.body
  let ProdPic = 'tenant'; // Default part of the filename

  // Check if the base64 image (net_image) is provided, if yes, skip file upload
  if (net_image && net_image.length > 0) {
    return next();
  }

  // If no file is uploaded
  if (!pic) {
    return next(); // Continue without error, since it's optional in your logic
  }

  // If a file is uploaded but is not an image
  if (pic && !pic.mimetype.startsWith("image")) {
    CatchHistory({
      api_response: `User with ${userData?.user_id} uploaded a file with no image extension for product`,
      function_name: 'ProdPicVerify',
      date_started: systemDate,
      sql_action: "SELECT",
      event: "Add new product",
      actor: userData?.user_id
    }, req);
    return sendResponse(res, 0, 401, 'Please upload an image file for the product');
  }

  // Generate the new filename using the tenant_id and serial number
  let fileExtension = path.parse(pic?.name).ext; // Get the file extension
  pic.name = `${ProdPic}-${tenant_id}-serial-${imageId}${fileExtension}`;
  console.log(`${ProdPic}-${tenant_id}-serial-${imageId}${fileExtension}`);

  // Check if the file already exists
  if (!fs.existsSync(`${prodPicUploadLink}${pic.name}`)) {
    console.log('File does not exist, saving product...');
    // Move the uploaded image to the designated directory
    pic.mv(`${prodPicUploadLink}${pic.name}`, (err) => {
      if (err) {
        console.log(err);
        return sendResponse(res, 0, 500, 'Image upload failed');
      }
    });
  }

  next(); // Continue to the next middleware
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

    pic.name = `${ProdPic}-${tenant_id}-serial-${imageId}${path.parse(pic.name).ext}`;
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