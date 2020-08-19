const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Gstar:Gstar@online-shopee.wpqjf.mongodb.net/<dbname>?retryWrites=true&w=majority', 
                    {useUnifiedTopology: true,useNewUrlParser : true}).then(() => console.log('DB connected'))
                                            .catch(err => console.error(err));



app.get('/', (req,res) => {
    res.send('hello world');
});

app.listen(5000);