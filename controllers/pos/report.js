const asynHandler = require("../../middleware/async");
const { sendResponse, CatchHistory } = require("../../helper/utilfunc");
const GlobalModel = require("../../model/Global");
const { IncomeAndExpenseCombined, IncomeReport, ExpenseReport, ProductSummariesReport, ProductListReport, CategorySalesReport, SalesProfitCharges, EmployeePerformanceReport, ProfitMarginsReport, OverheadExpenseReport, CheckReorderReport, CheckReorderByOutletReport, OutletSummariesReport } = require("../../model/Reporting");
const { ProfitByOutletByDate } = require("../../model/Order");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");



exports.IncomeAndExpenseReport = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    let { report_type } = req.body

    if (report_type === 'combined') {
        let results = await IncomeAndExpenseCombined(tenant_id);
        if (results.rows.length == 0) {
            CatchHistory({ api_response: "No Record Found", function_name: 'IncomeAndExpenseReport/IncomeAndExpenseCombined', date_started: systemDate, sql_action: "SELECT", event: "View combined income and expenses report", actor: userData.id }, req)
            return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
        }
        CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} income and expense combined report`, function_name: 'IncomeAndExpenseReport/IncomeAndExpenseCombined', date_started: systemDate, sql_action: "SELECT", event: "View combined income and expenses report", actor: userData.id }, req)

        return sendResponse(res, 1, 200, "Record Found", results.rows)

    }
    if (report_type === 'income') {
        let results = await IncomeReport(tenant_id);
        if (results.rows.length == 0) {
            CatchHistory({ api_response: "No Record Found", function_name: 'IncomeAndExpenseReport/IncomeReport', date_started: systemDate, sql_action: "SELECT", event: "View income report", actor: userData.id }, req)
            return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
        }
        CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} income report`, function_name: 'IncomeAndExpenseReport/IncomeReport', date_started: systemDate, sql_action: "SELECT", event: "View income report", actor: userData.id }, req)

        return sendResponse(res, 1, 200, "Record Found", results.rows)

    }
    if (report_type === 'expense') {
        let results = await ExpenseReport(tenant_id);
        if (results.rows.length == 0) {
            CatchHistory({ api_response: "No Record Found", function_name: 'IncomeAndExpenseReport/ExpenseReport', date_started: systemDate, sql_action: "SELECT", event: "View expense report", actor: userData.id }, req)
            return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
        }
        CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} expense report`, function_name: 'IncomeAndExpenseReport/ExpenseReport', date_started: systemDate, sql_action: "SELECT", event: "View expense report", actor: userData.id }, req)

        return sendResponse(res, 1, 200, "Record Found", results.rows)

    }
})
exports.ProductReport = asynHandler(async (req, res, next) => {
    let userData = req.user;
    let tenant_id = userData?.tenant_id


        let results = await ProductSummariesReport(tenant_id);
        let products = await ProductListReport(tenant_id);
   
        CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} income and expense combined report`, function_name: 'ProductReport/summaries/productlist', date_started: systemDate, sql_action: "SELECT", event: "View products report", actor: userData.id }, req)

        return sendResponse(res, 1, 200, "Record Found", {summaries: results.rows, products:products.rows})



})
exports.OutletInventoryReport = asynHandler(async (req, res, next) => {
  let userData = req.user;
  let tenant_id = userData?.tenant_id


      let results = await OutletSummariesReport(tenant_id);
      let products = await ProductListReport(tenant_id);
 
      CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} income and expense combined report`, function_name: 'ProductReport/summaries/productlist', date_started: systemDate, sql_action: "SELECT", event: "View products report", actor: userData.id }, req)

      return sendResponse(res, 1, 200, "Record Found", {summaries: results.rows, products:products.rows})



})

exports.SalesByCategory = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await CategorySalesReport(start, today, tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })

  exports.SalesAndProfitCharges = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await SalesProfitCharges(start, today, tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })
  exports.ViewEmployeePerformance = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await EmployeePerformanceReport(start, today, tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })

  exports.ViewProfitMargins = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await ProfitMarginsReport(start, today, tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })

  exports.ViewOverheadExpenses = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await OverheadExpenseReport(tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })
  exports.ViewReorderReport = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await CheckReorderReport(tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })
  exports.ViewReorderReportByOutlet = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await CheckReorderByOutletReport(tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })
  exports.ViewProfitPerOutlet = asynHandler(async (req, res) => {
    let { start, end } = req.body
    let userData = req.user;
    let tenant_id = userData?.tenant_id
    var process_end_date = new Date(end);
    var final_end_date = process_end_date.setDate(new Date(process_end_date).getDate() + 1);
    let today = new Date(final_end_date);
    let results = await ProfitByOutletByDate(start, today, tenant_id);
    sendResponse(res, 1, 200, "Record Found", {records: results.rows, })
  })