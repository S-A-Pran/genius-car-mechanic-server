const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftrdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
      await client.connect();
      const database = client.db('car-mechanic');
      const servicesCollection = database.collection('services');
      

      //post
      app.post('/services', async(req, res) => {
        const service = req.body
        console.log('hitting the post', service);
        const result = await servicesCollection.insertOne(service);
        res.json(result);
      })
      //get single 
      app.get('/services/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          console.log(id);
          const result = await servicesCollection.findOne(query);
          res.json(result);
      })

      //get all
      app.get('/services', async(req, res) => {
          const cursor = servicesCollection.find({});
          const result = await cursor.toArray();
          res.send(result);
      })

      //Delete single
      app.delete('/services/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await servicesCollection.deleteOne(query);
          res.json(result);

      })



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('Hello .....');
})


app.listen(port, ()=>{
    console.log('listening to port', port);
})