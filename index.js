const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors =require('cors');
require('dotenv').config();


const app =express();
const port = 7000;

app.use(cors());
app.use(express.json());

// user: rahul2
// pasword: u2K6qRTaeb8QJWqI


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
	try{
		await client.connect();
		// console.log('connected to database')
		const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //get api

        app.get('/services',async(req, res) =>{
        	const cursor =servicesCollection.find({});
        	const services = await cursor.toArray();
        	res.send(services);

        });

        // get single service

         app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



        //post api
        app.post('/services',async(req, res) => {

        	const service =req.body;

        	console.log('hit the api', service);

        	const result = await servicesCollection.insertOne(service);
        	console.log(result);

        res.json(result);
        });

        //Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
            console.log('delete delete de')
        })


	}
	finally{
		// await client.close();
	}
}

run ().catch(console.dir);

app.get('/',(req, res)=>{
	res.send('runing ginius car server')
});

app.listen(port, ()=>{
	console.log('run ginius server port', port)
})