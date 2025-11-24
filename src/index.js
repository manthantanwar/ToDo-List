const express = require('express')
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://manthankumar:DRdwwpc5da3xwXTV@cluster0.gax1eez.mongodb.net/Manthan29-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.use(function (req, res){
    return res.status(400).send({status: false, message: "Path not found"})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})