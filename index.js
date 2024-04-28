const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5001
require('dotenv').config();


// Middleware
app.use(cors())
app.use(express.json())



// URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jryyhrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
  
    // await client.connect();

    const craftCollection = client.db('artAndCraftDB').collection('craft')

    app.get('/crafts', async (req, res)=> {
        const cursor = craftCollection.find();
        const result = await cursor.toArray()
        res.send(result);
    })

    app.post('/crafts', async (req, res)=> {
        const newCraft = req.body;
        const result = await craftCollection.insertOne(newCraft);
        res.send(result);
    })


    app.get('/myCraft/:email', async (req, res)=> {
        const email = req.params.email;
        const query = {user_email: email}
        const result = await craftCollection.find(query).toArray();
        res.send(result)
    })

    app.get('/details/:id', async (req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query)
      res.send(result);
    })


    app.put('/crafts/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const craft = req.body;
      const updatedCraft = {
        $set : {
          customization: craft.customization,
          description: craft.description,
          item_name: craft.item_name,
          photo: craft.photo,
          price: craft.price,
          processing_time: craft.processing_time,
          rating: craft.rating,
          stock_status: craft.stock_status,
          sub_category_name: craft.sub_category_name,
          user_email: craft.user_email,
          user_name: craft.user_name,
        }
      }
      const result = await craftCollection.updateOne(filter, updatedCraft, options)
      res.send(result)
    })


    app.delete('/crafts/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })

    
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
    res.send('Art and Craft Server is running..')
})

app.listen(port, ()=> {
    console.log("Art and Craft Server is Running on port", port)
})