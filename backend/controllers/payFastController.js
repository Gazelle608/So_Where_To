const PayFast = require('node-payfast-express');

const payfast = new PayFast({
  merchant_id: process.env.PAYFAST_MERCHANT_ID,
  merchant_key: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE,
  sandbox: true // set false for production
});

// Create Payment
exports.createPayment = (req, res) => {
  const paymentData = {
    amount: "100.00",
    item_name: "Test Product",
    return_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel",
    notify_url: "http://localhost:3000/payment/notify"
  };

  const paymentUrl = payfast.generatePaymentUrl(paymentData);
  res.redirect(paymentUrl);
};

//  ITN (Notify URL)
exports.notify = async (req, res) => {
  try {
    const isValid = await payfast.validateITN(req.body);

    if (isValid) {
      console.log("Payment successful:", req.body);
      // Update database here
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("ITN Error:", error);
    res.sendStatus(500);
  }
};

// Success
exports.success = (req, res) => {
  res.send("Payment successful!");
};
// Cancel
exports.cancel = (req, res) => {
  res.send("Payment cancelled.");
};
