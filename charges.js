function calculatePaymentDetails(order) {
    // Calculate the total amount for all items in the order
    const totalAmount = order.items.reduce((total, item) => {
      const itemPrice = item.price * item.qty;
      return total + itemPrice;
    }, 0);
  
    // Calculate charges (as a percentage of the total items price)
    const charges = (order.charges / 100) * totalAmount;
  
    // Apply discount (if any)
    const discountedAmount = totalAmount - (order.discount || 0);
  
    // Calculate the total amount to be paid
    const totalToBePaid = discountedAmount;
  
    // Calculate the balance to be given to the customer
    let balance = order.cash_received - totalToBePaid;
  
    // If the payment method is 'credit' and cash_received is less than totalToBePaid, set balance to zero
    if (order.payment_method === 'credit' && order.cash_received < totalToBePaid) {
      balance = 0;
    }
  
    // Initialize credit-related variables
    let totalAmountPaid = 0;
    let totalAmountDue = 0;
    let totalAmountRemaining = 0;
  
    // Determine the payment method
    const paymentMethod = order.payment_method === 'credit' ? 'Credit' : 'Cash';
  
    if (paymentMethod === 'Credit') {
      totalAmountPaid = order.cash_received;
      totalAmountDue = totalToBePaid;
      totalAmountRemaining = totalAmountDue - totalAmountPaid;
    }
  
    return {
      totalAmount,
      discount: order.discount || 0,
      charges,
      totalToBePaid,
      balance,
      paymentMethod,
      totalAmountPaid,
      totalAmountDue,
      totalAmountRemaining,
    };
  }
  
  // Example order object with payment method set to 'credit'
  const order = {
    items: [
      {
        qty: 3,
        product_id: "b88cea40-cd90-4d80-84d4-792c7c6bff9a",
        price: 200.00
      }
    ],
    customer: "Ricardo",
    discount: 2,
    charges: 2,
    cash_received: 500, // Less than totalToBePaid
    notes: "Sales 24th October",
    payment_method: "cash",
    to_be_delivered: true,
    delivery_address: "Accra"
  };
  
  const paymentDetails = calculatePaymentDetails(order);
  
  console.log("Total Amount:", paymentDetails.totalAmount);
  console.log("Discount:", paymentDetails.discount);
  console.log("Charges:", paymentDetails.charges);
  console.log("Total To Be Paid:", paymentDetails.totalToBePaid);
  console.log("Balance To Be Given:", paymentDetails.balance);
  console.log("Payment Method:", paymentDetails.paymentMethod);
  
  // Credit-related fields
  console.log("Total Amount Paid:", paymentDetails.totalAmountPaid);
  console.log("Total Amount Due:", paymentDetails.totalAmountDue);
  console.log("Total Amount Remaining:", paymentDetails.totalAmountRemaining);
  