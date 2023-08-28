const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// zahid84
// BXoLBiOtBczNlJBj



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjxc9jf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCollection = client.db("carDoctorDB").collection("services");
    const productsCollection = client.db("carDoctorDB").collection("products");
    const bookingCollection = client.db("carDoctorDB").collection("bookings");


    app.get('/services', async(req, res) => {
        const services = await servicesCollection.find().toArray();
        res.send(services);
    })
    app.get('/products', async(req, res) => {
        const products = await productsCollection.find().toArray();
        res.send(products);
    })

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })
    app.get('/bookings', async(req, res) => {
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email}
      }
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });
    // bookings


    app.post('/bookings', async(req, res) => {
      const booking = req.body;
        const bookings = await bookingCollection.insertOne(booking);
        res.send(bookings);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car Doctor is Running');
});


app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});