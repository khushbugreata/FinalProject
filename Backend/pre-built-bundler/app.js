const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');



//data fetching API call

const { getStoredItems, storeItems } = require('./data/items');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/items', async (req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  res.json({ items: storedItems });
});

app.get('/items/:id', async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});



app.post('/items', async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: 'Stored new item.', item: newItem });
});



//payment gateway integration
app.use(cors());

// PayPal configuration
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVC1O9NEfD0o94dv9J4wLfcN0FqZHWFjmfUoJJrTuMzJv_J3iXGL9BashJbVX7LDKvQJ8D4TUzWpF51d',
    'client_secret': 'EOvHFsQn2UPCXw9tj7kJ8lwlZXgOYiYHmNTyariRr2mcnhE10d0-dZGM_jyw9CMmq5I2ZQswLbwGlG4Q'
});

// Define routes
// Add routes for payment initiation, success, and failure

app.get('/payment', async (req, res) => {

  let data
  try {

      let create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:8000/success",
              "cancel_url": "http://localhost:8000/failed"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": "item",
                      "sku": "item",
                      "price": "1.00",
                      "currency": "USD",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total": "1.00"
              },
              "description": "This is the payment description."
          }]
      };


      await paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error;
          } else {
              console.log("Create Payment Response");
              // console.log(payment);
              data = payment;
              res.json(data);

          }
      });


  } catch (error) {
      console.log(error);
  }
})



app.get('/success', async (req, res) => {

  try {

      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total": "1.00"
              }
          }]
      }


      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log(error)
              return res.redirect("http://localhost:5173/failed");
          } else {
              console.log("Execute Payment Response");
              // console.log(payment);
              const response = JSON.stringify(payment);
              const parsedResponse = JSON.parse(response);

              const transactions = parsedResponse.transactions[0];

              console.log("transactions", transactions);

              return res.redirect("http://localhost:5173/success");
          }
      })


  } catch (error) {
      console.log(error);
  }

})


app.get('/failed', async (req, res) => {

  return res.redirect("http://localhost:5173/failed");
})
// Start the server

app.listen(8080);