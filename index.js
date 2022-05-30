const express = require('express')
const mongoose = require('mongoose')
const useRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('dotenv').config()
const app = express()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ruuko.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri)

app.use(express.json())
app.use(useRouter)
app.use(taskRouter)
const PORT = process.env.PORT

console.log(mongoose.connection.readyState);


app.listen(PORT)
