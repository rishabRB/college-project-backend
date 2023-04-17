const express = require('express');
const app = express();
const userRoutes = require('./routes/user')
const booksRoutes = require('./routes/books')
const PORT = 3030
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()


app.use(express.json())
app.use(cors())
app.use('/user',userRoutes)
app.use('/books',booksRoutes)

app.listen(PORT,()=>console.log(`server is up on ${PORT}`))

