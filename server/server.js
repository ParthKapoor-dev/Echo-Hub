require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin:"http://localhost:5173"
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// It is used to add the json content to the request object & is supposed to be used before any other middleware

const userRouter = require('./router/userRouter');
const articleRouter = require('./router/articleRouter');
const accountUserRouter = require('./router/accountUserRouter');
const searchPageRouter = require('./router/SearchPageRouter')

app.use('/user', userRouter);
app.use('/article',articleRouter);
app.use('/accounts', accountUserRouter);
app.use('/search/', searchPageRouter);



app.get('/', (req , res)=>{
    res.json({message:'ON HOME PAGE'})
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log('Connected to db and listening to port👻')
    })
}).catch(error=>{
    console.log(error)
})
