const router = require('express').Router()
const { MongoClient } = require('mongodb')

const dbName = 'Library-management';



router.get('/allbooks',async (req,res)=>{
   const client = new MongoClient(process.env.MONGO_URI)
   try{
    await client.connect()
    const database = client.db(dbName)
    const books = database.collection('issueBook')
    const book = await books.find({}).toArray()
    if(book) res.status(200).json(book)
    else res.status(400).send("No book issued")
    await client.close()
   }
   catch(err){
    console.log(err)
   }
})


router.post('/addbooks',async (req,res)=>{
    const data = req.body
    const client = new MongoClient(process.env.MONGO_URI)
    const bookdata = {
        name: data.book_name,
        description:data.description,
        author: data.author_name,
        availableBooks: data.totalBooks,
        bookIssued: 0,
        numberOfBooks: data.totalBooks,
        book_id: data.book_id,
        book_image: data.image_url
    }
    try{
        await client.connect()
        const database = client.db(dbName)
        const books = database.collection('books')

        const exits = books.findOne({book_id:data.book_id})
        if(exits) res.status(204).send("book already exits")

        const response = books.insertOne(bookdata)
        if(response.acknowledged) res.status(200).json(true)
        else res.status(400).send(false)
    }
    catch(err){
        console.log(err)
    }
})


//delete books
router.delete('/deleteissuedBook',async(req,res)=>{
    const client = new MongoClient(process.env.MONGO_URI)
    try{
        const query = req.query
        await client.connect()
        const database = client.db(dbName)
        const retuenBook = database.collection('returnBooks')
        const book = database.collection('issueBook')

        //functions 
        const bookDetail = await book.findOne(query)
        if(bookDetail) await retuenBook.insertOne(bookDetail)

        const response = await book.findOneAndDelete(query)
        if(response.value){
            res.status(200).json(true)
        }
        else if(response.value === null) res.status(400).send("No data found")
    }
    catch(err){
        console.log(err)
    }
})


//isssued books

router.get('/issuedBook',async(req,res)=>{
    const client = new MongoClient(process.env.MONGO_URI)
    try{
        const {registration_number} = req.query
        await client.connect()
        const database = client.db(dbName)
        const book = database.collection('issueBook')
        const response = await book.find({registration_number:registration_number}).toArray()
        if(response.length != 0) res.status(200).json(response)
        else res.status(400).send("No data found")
    }
    catch(err){
        console.log(err)
    }
})


// get book
router.get('/getbook',async(req,res)=>{
    const client = new MongoClient(process.env.MONGO_URI)
    try{

        const query = (req.query) 
        await client.connect()
        const database = client.db(dbName)
        const books = database.collection('books')
        const response = await books.findOne(query);
        if(response) res.status(200).json(response)
        else res.status(400).send(false)
    }
    catch(err){
        console.log(err)
    }
})



//issue book
router.post('/issuebook',async(req,res)=>{
    const client = new MongoClient(process.env.MONGO_URI)
    try{
        const data = req.body
        console.log(req.body)
        await client.connect()
        const database = client.db(dbName)
        const book = database.collection('issueBook')
        const response = await book.insertOne(data)

        if(response.acknowledged) res.status(200).json(true)
        else res.status(400).send(false)

    }
    catch(err){
        console.log(err)
    }
})

module.exports = router