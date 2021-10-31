const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kytmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('dreamy_travel_data');
        const serviceCollections = database.collection('services');
        const hotelServices = database.collection('hotelServices');
        const orderCollection = database.collection('orders');
        const cartCollection = database.collection('orderCart');

        app.get('/hotelServices', async (req, res) => {
            const cursor = hotelServices.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services', async (req, res) => {
            const cursor = serviceCollections.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const service = await serviceCollections.findOne(query);
            res.json(service);

        })
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollections.deleteOne(query);
            res.json(result);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await serviceCollections.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.createdAt = new Date();
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
        app.post('/cart', async (req, res) => {
            const order = req.body;
            const result = await cartCollection.insertOne(order);
            res.json(result);
        })
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(typeof (id));
            const query = { _id: id };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }

};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running....');
});
app.listen(port, () => {
    console.log('Running Port', port);
});
