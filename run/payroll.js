require('dotenv').config({ path: "./config/config.env" });
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

// Function to calculate net pay for an employee
function calculateNetPay(employee, band, allowances, deductions) {
    try {
      let totalTax = 0;
  
      const grossSalary = band?.band_basic_salary +
        allowances.reduce((total, allowance) => {
          const allowanceAmount = allowance.is_flat_rate ? parseFloat(allowance.flat_rate) : (band?.band_basic_salary * parseFloat(allowance.percentage_rate) / 100);
  
          // Calculate tax if the allowance is taxable
          if (allowance.is_taxable) {
            const taxableAmount = allowance.is_flat_rate ? parseFloat(allowance.taxable_flat_rate) : (allowanceAmount * parseFloat(allowance.taxable_percentage_rate) / 100);
            totalTax += isNaN(taxableAmount) ? 0 : taxableAmount;
          }
  
          return total + (isNaN(allowanceAmount) ? 0 : allowanceAmount);
        }, 0);
  
      const totalDeductions = deductions.reduce((total, deduction) => {
        const deductionAmount = deduction.is_flat_rate ? parseFloat(deduction.flat_rate) : (grossSalary * parseFloat(deduction.percentage_rate) / 100);
        return total + (isNaN(deductionAmount) ? 0 : deductionAmount);
      }, 0);
  
      const netPay = grossSalary - totalDeductions - totalTax;
  
      return {
        employee_id: employee.employee_id,
        netPay: netPay.toFixed(2),
        totalTax: totalTax.toFixed(2)
      };
  
    } catch (error) {
      console.error('Error in calculateNetPay for employee', employee.employee_id, error);
      return { employee_id: employee.employee_id, netPay: '0.00', totalTax: '0.00' };
    }
  }
// Function to fetch employee details
// Function to fetch employee details
async function fetchEmployeeDetails() {
    const res = await pool.query('SELECT * FROM public.account');
    return res.rows;
  }
  
  // Function to fetch band for an employee
  async function fetchBandForEmployee(employeeId) {
    const res = await pool.query('SELECT gb.* FROM public.group_band gb JOIN public.user_group_band ugb ON gb.group_band_id = ugb.group_band_id WHERE ugb.employee_id = $1', [employeeId]);
    return res.rows[0]; // Assuming one band per employee
  }
  
  // Function to fetch allowances for an employee
  async function fetchAllowancesForEmployee(employeeId) {
    const res = await pool.query('SELECT sa.* FROM public.salary_allowance sa JOIN public.group_band_allowance gba ON sa.salary_allowance_id = gba.salary_allowance_id WHERE gba.employee_id = $1', [employeeId]);
    return res.rows;
  }
  
  // Function to fetch deductions for an employee
  async function fetchDeductionsForEmployee(employeeId) {
    const res = await pool.query('SELECT sd.* FROM public.salary_deduction sd JOIN public.group_band_deduction gbd ON sd.salary_deduction_id = gbd.salary_deduction_id WHERE gbd.employee_id = $1', [employeeId]);
    return res.rows;
  }
  
  
  // Function to insert payroll results
  async function insertPayrollResults(employeeId, netPay, totalTax, payrollRunId,run_month,run_year) {
    // Insert into public.payroll_run_details
    await pool.query('INSERT INTO public.payroll_run_details (employee_id, net_pay, total_tax, payroll_run_id,run_month,run_year) VALUES ($1, $2, $3, $4,$5,$6)', [employeeId, netPay, totalTax, payrollRunId,run_month,run_year]);
  
    // ... [Additional logic to insert into payroll_deduction_calculations, payroll_allowance_calculations, taxable_allowance_calculations, calculation_logs]
  }
  
  // Function to check if payroll can be executed for the given period
  async function canExecutePayroll(run_purpose, month, year) {
    const res = await pool.query('SELECT * FROM public.payroll_runs WHERE payroll_month = $1 AND payroll_year = $2 AND run_purpose = $3 AND status = \'completed\'', [month, year, run_purpose]);
    return res.rows.length === 0;
  }
  
  // Main function to execute the payroll process
// Main function to execute the payroll process
async function executePayroll() {
    try {
      const run_purpose = 'Regular'; // Could be 'Bonus', 'Adjustment', etc.
      const payrollMonth = 9/* current month */;
      const payrollYear = 2023 /* current year */;
      const payrollRunId = '58b81c59-c8f4-449a-99ab-2162da100200'/* logic to determine the current payroll run ID */;
  
      if (await canExecutePayroll(run_purpose, payrollMonth, payrollYear)) {
        const employees = await fetchEmployeeDetails();
        for (const employee of employees) {
          const band = await fetchBandForEmployee(employee.account_id); // Using account_id as employee_id
          if (band) {
            const allowances = await fetchAllowancesForEmployee(employee.account_id);
            console.log('====================================');
            console.log(allowances);
            console.log('====================================');
            const deductions = await fetchDeductionsForEmployee(employee.account_id);
    
            const payrollResult = calculateNetPay(employee, band, allowances, deductions);
            await insertPayrollResults(employee.account_id, payrollResult.netPay, payrollResult.totalTax, payrollRunId,payrollMonth,payrollYear);
            // ... [Insert additional details into other tables]
          }
        }
        console.log(`Payroll calculation completed for ${run_purpose}.`);
      } else {
        console.log(`Payroll already completed for ${run_purpose} in ${payrollMonth}/${payrollYear}. Skipping execution.`);
      }
    } catch (err) {
      console.error('Error executing payroll:', err);
    }
  }
  
  executePayroll();