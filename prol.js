require('dotenv').config();
// const { Pool } = require('pg'); // Uncomment if using a real database

const sampleData = {
  employees: [
    {
      employee_id: "e1",
      name: "John Doe"
    },
    {
      employee_id: "e2",
      name: "Jane Smith"
    }
  ],
  bands: {
    "e1": {
      band_id: "b1",
      band_basic_salary: 3000
    },
    "e2": {
      band_id: "b2",
      band_basic_salary: 3500
    }
  },
  allowances: {
    "e1": [
      {
        allowance_id: "a1",
        is_flat_rate: true,
        flat_rate: 200,
        is_taxable: true,
        taxable_flat_rate: 50
      }
    ],
    "e2": [
      {
        allowance_id: "a2",
        is_flat_rate: false,
        percentage_rate: 10
      }
    ]
  },
  deductions: {
    "e1": [
      {
        deduction_id: "d1",
        is_flat_rate: true,
        flat_rate: 100
      }
    ],
    "e2": [
      {
        deduction_id: "d2",
        is_flat_rate: false,
        percentage_rate: 5
      }
    ]
  }
};

// Mock function to fetch employee details
async function fetchEmployeeDetails() {
  return sampleData.employees;
}

// Mock function to fetch band for an employee
async function fetchBandForEmployee(employeeId) {
  return sampleData.bands[employeeId];
}

// Mock function to fetch allowances for an employee
async function fetchAllowancesForEmployee(employeeId) {
  return sampleData.allowances[employeeId] || [];
}

// Mock function to fetch deductions for an employee
async function fetchDeductionsForEmployee(employeeId) {
  return sampleData.deductions[employeeId] || [];
}

// Function to calculate net pay for an employee
function calculateNetPay(employee, band, allowances, deductions) {
    try {
      let totalTax = 0;
  
      const grossSalary = band.band_basic_salary +
        allowances.reduce((total, allowance) => {
          const allowanceAmount = allowance.is_flat_rate ? parseFloat(allowance.flat_rate) : (band.band_basic_salary * parseFloat(allowance.percentage_rate) / 100);
  
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
  

// Mock function to insert payroll results
async function insertPayrollResults(employeeId, netPay) {
  console.log(`Payroll results for Employee ID ${employeeId}: Net Pay = ${netPay}`);
}

// Main function to execute the payroll process
async function executePayroll() {
  try {
    const employees = await fetchEmployeeDetails();
    for (const employee of employees) {
      const band = await fetchBandForEmployee(employee.employee_id);
      const allowances = await fetchAllowancesForEmployee(employee.employee_id);
      const deductions = await fetchDeductionsForEmployee(employee.employee_id);

      const payrollResult = calculateNetPay(employee, band, allowances, deductions);
  await insertPayrollResults(employee.employee_id, payrollResult.netPay, payrollResult.totalTax);

  // Optionally, log the total tax for each employee
  console.log(`Total tax for Employee ID ${employee.employee_id}: ${payrollResult.totalTax}`);

    }
    console.log('Payroll calculation completed.');
    
  } catch (err) {
    console.error('Error executing payroll:', err);
  }
}

executePayroll();
