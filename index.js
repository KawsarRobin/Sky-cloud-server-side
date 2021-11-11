const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// Middle-Wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4g6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db('skyCloud').collection('products');
    const ordersCollection = client.db('skyCloud').collection('orders');
    const usersCollection = client.db('skyCloud').collection('orders');

    // Find Single Product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result);
    });

    //Find All Products
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // Add An Order
    app.post('/addOrder', async (req, res) => {
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder);
      res.json(result);
    });
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Drone server is running');
});

app.listen(port, () => {
  console.log('listening to the port', port);
});
