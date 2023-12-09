// const { Client } = require('pg');

// Sample data for employees, bands, allowances, deductions, and payroll setup
const employeesData = [
    {
      employee_id: '6b7102f2-3c60-11ec-8d3d-0242ac130003',
      first_name: 'John',
      last_name: 'Doe',
      group_band_id: '3a6b4dd0-3c60-11ec-8d3d-0242ac130003', // Entry Level band
    },
    {
      employee_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003',
      first_name: 'Jane',
      last_name: 'Smith',
      group_band_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003', // Mid Level band
    },
    {
      employee_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
      first_name: 'Bob',
      last_name: 'Johnson',
      group_band_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003', // Senior Level band
    },
    {
      employee_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003',
      first_name: 'Alice',
      last_name: 'Anderson',
      group_band_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003', // Executive Level band
    },
    {
      employee_id: 'ab8c7d2a-3c60-11ec-8d3d-0242ac130003',
      first_name: 'Charlie',
      last_name: 'Chaplin',
      group_band_id: 'ab8c7d2a-3c60-11ec-8d3d-0242ac130003', // Director Level band
    },
  ];
  
  // Sample data for bands
  const bandsData = [
    {
      group_band_id: '3a6b4dd0-3c60-11ec-8d3d-0242ac130003',
      group_band_name: 'Entry Level',
      band_basic_salary: 50000.00,
    },
    {
      group_band_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003',
      group_band_name: 'Mid Level',
      band_basic_salary: 70000.00,
    },
    {
      group_band_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
      group_band_name: 'Senior Level',
      band_basic_salary: 90000.00,
    },
    {
      group_band_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003',
      group_band_name: 'Executive Level',
      band_basic_salary: 120000.00,
    },
    {
      group_band_id: 'ab8c7d2a-3c60-11ec-8d3d-0242ac130003',
      group_band_name: 'Director Level',
      band_basic_salary: 150000.00,
    },
  ];
  
  // Sample data for allowances
  const allowancesData = [
    {
      band_allowance_id: '6c3e79e8-3c60-11ec-8d3d-0242ac130003',
      band_allowance_name: 'Housing Allowance',
      salary_allowance_id: '4e12d3e2-3c60-11ec-8d3d-0242ac130003',
      group_band_id: '3a6b4dd0-3c60-11ec-8d3d-0242ac130003',
      source_bank_account_id: 'employer_account_id',
      employee_id: '6b7102f2-3c60-11ec-8d3d-0242ac130003',
      flat_rate: 2000.00,
      percentage_rate: 0.0,
    },
    {
      band_allowance_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003',
      band_allowance_name: 'Transport Allowance',
      salary_allowance_id: '5f27e9ce-3c60-11ec-8d3d-0242ac130003',
      group_band_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003',
      source_bank_account_id: 'employer_account_id',
      employee_id: '7a3a6c60-3c60-11ec-8d3d-0242ac130003',
      flat_rate: 1500.00,
      percentage_rate: 0.0,
    },
    // Add more allowances as needed
  ];
  
  // Sample data for deductions
  const deductionsData = [
    {
      band_deduction_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
      band_deduction_name: 'Income Tax',
      salary_deduction_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
      group_band_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
      source_type: 'Percentage',
      deduction_bank_account_id: 'employer_account_id',
      flat_rate: 0.0,
      percentage_rate: 5.0,
    },
    {
      band_deduction_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003',
      band_deduction_name: 'Pension Contribution',
      salary_deduction_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003',
      group_band_id: '9d6d5b8a-3c60-11ec-8d3d-0242ac130003',
      source_type: 'Fixed',
      deduction_bank_account_id: 'employer_account_id',
      flat_rate: 1000.00,
      percentage_rate: 0.0,
    },
    // Add more deductions as needed
  ];
  

const payrollSetupData = [
  {
    payroll_setup_id: '8c6c5a2a-3c60-11ec-8d3d-0242ac130003',
    pay_period_id: 'ac53455a-3c63-11ec-8d3d-0242ac130003',
    generate_payslip: true,
  },
  // Add more payroll setups as needed
];

// Function to calculate net pay for an employee
// Function to calculate net pay for an employee
// Function to calculate net pay for an employee
// Function to calculate net pay for an employee
function calculateNetPay(employee, band, allowances, deductions) {
    const grossSalary = band.band_basic_salary +
      allowances.reduce((total, allowance) => {
        const allowanceAmount = parseFloat(allowance.flat_rate) + (band.band_basic_salary * parseFloat(allowance.percentage_rate) / 100);
        console.log('Allowance:', allowance);
        console.log('Calculation:', total + (isNaN(allowanceAmount) ? 0 : allowanceAmount));
        return total + (isNaN(allowanceAmount) ? 0 : allowanceAmount);
      }, 0);
  
    const totalDeductions = deductions.reduce((total, deduction) => {
      const deductionAmount = (deduction.source_type === 'Fixed' ? parseFloat(deduction.flat_rate) : (grossSalary * parseFloat(deduction.percentage_rate) / 100));
      console.log('Deduction:', deduction);
      console.log('Calculation:', total + (isNaN(deductionAmount) ? 0 : deductionAmount));
      return total + (isNaN(deductionAmount) ? 0 : deductionAmount);
    }, 0);
  
    console.log('Gross Salary:', grossSalary);
    console.log('Total Deductions:', totalDeductions);
  
    const netPay = grossSalary - totalDeductions;
  
    return {
      employee_id: employee.employee_id,
      netPay: netPay.toFixed(2),
    };
  }
  

// Function to run payroll for a specific pay period
async function runPayroll(payrollSetup, employees, bands, allowances, deductions) {
  const results = [];

  for (const employee of employees) {
    const band = bands.find(b => b.group_band_id === employee.group_band_id);
    const employeeAllowances = allowances.filter(a => a.employee_id === employee.employee_id);
    const employeeDeductions = deductions.filter(d => d.group_band_id === employee.group_band_id);

    const payrollResult = calculateNetPay(employee, band, employeeAllowances, employeeDeductions);

    results.push(payrollResult);
  }

  return results;
}

// Function to log payroll results
function logPayrollResults(results) {
  results.forEach(result => {
    console.log(`Employee ID: ${result.employee_id}, Net Pay: $${result.netPay}`);
  });
}

// Connect to the PostgreSQL database
// const client = new Client({
//   user: 'your_username',
//   host: 'your_host',
//   database: 'your_database',
//   password: 'your_password',
//   port: 5432,
// });

async function main() {
  try {
    // await client.connect();

    // Insert sample data into the tables (you may replace this with your actual data insertion logic)
    // ...

    // Fetch the payroll setup for the desired pay period
    const payrollSetup = payrollSetupData[0]; // Assuming you want to run payroll for the first setup

    // Fetch employees for the selected pay period
    const employees = employeesData;

    // Run payroll for the selected pay period
    const payrollResults = await runPayroll(payrollSetup, employees, bandsData, allowancesData, deductionsData);

    // Log the payroll results
    logPayrollResults(payrollResults);
  } catch (error) {
    console.error('Error running payroll:', error);
  } finally {
    // await client.end();
  }
}

// Run the main function
main();
