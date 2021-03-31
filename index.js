
const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;

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
  
  console.log('connected to db');
  
//   client.close();
});

//optional
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})