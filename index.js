
const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("bson-objectid");

const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzd7k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products");

  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

  //get products from db
  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, products) => {
        res.send(products);
      })
  })

  //for getting one specific product 
  app.get('/product/:productId', (req, res) => {
    let id = req.params.productId;

    productCollection.find({ "_id": ObjectID(id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  //add product
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    
    //save product to database
    productCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  //save order to db for requesting addOrder
  app.post('/addOrder', (req, res) => {
    const order = req.body; // as the method is post
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  //for display orders
  app.post('/orders', (req, res) => {
    const email = req.body.email;
    
    orderCollection.find({"email" : email})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  //for deleting one Product
  
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.value);
    })
    
  })

  //for deleting an Order
  
  app.delete('/deleteOrder/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    orderCollection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.value);
    })
    
  })

});

//optional
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})