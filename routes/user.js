const router = require('express').Router()
const { response } = require('express');
const { MongoClient } = require('mongodb')

const dbName = 'Library-management';



// getting user data for login acttion
router.get('/login',async (req,res)=>{
    const {username,password} = req.query
    const client = new MongoClient(process.env.MONGO_URI)
    try{
    await client.connect()
    const database = client.db(dbName)
    const users = database.collection('User')
   
    const user = await users.findOne({username})
  
    if(user){
        if(user.password === password) res.status(200).json(user)
        else res.status(401).send('Wrong password')
    }
    else{
        res.status(501).send('Invalid username')
    }
    }catch(err){
        console.log(err)
    }
})


//inserting student details 
router.post("/studentdetail",async (req,res)=>{
    const data = req.body
    const client = new MongoClient(process.env.MONGO_URI)
    try{
        await client.connect()
        const database = client.db(dbName)
        const users = database.collection("studentDetail")

        const user = await users.findOne({registration_number:data.registration_number})
        if(user) res.status(400).send("student already exits")
        else{
        const response = await users.insertOne(data)
        if(response.acknowledged == true) res.status(200).send("student updated")
        }
    }
    catch(err){
        console.log(err)
    }
})


// fetching student details 
router.get("/getStudent",async (req,res)=>{
    const {registration_number} = req.query
    console.log(req.query)
    const client = new MongoClient(process.env.MONGO_URI)
    try{
        await client.connect()
        const database = client.db(dbName)
        const users = database.collection("studentDetail")

        const user = await users.findOne({registration_number:registration_number})
        if(user) res.status(200).json(user)
        else res.status(400).send("No student found")
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router