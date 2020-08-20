//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require('./models/user');

//connect to database

mongoose.connect(config.mangoURI, 
                    {useUnifiedTopology: true,useNewUrlParser : true}).then(() => console.log('DB connected'))
                                            .catch(err => console.error(err));


app.use(bodyParser.urlencoded({ extended : true })); 
app.use(bodyParser.json());             //to read json files
app.use(cookieParser());             

//Routing
app.post('/api/user/register',(req,res) => {
    const user = new User(req.body);

    user.save((err,userData) => {                                             //we have to save this in mangodb after saving we can get either error ir user data 
        if(err) return res.json({ succes:false, err})                          //if error occurs

        return res.status(200).json({
            success:true
        });                //returning succes status 
    })

   
})

app.get('/', (req,res) => {
    res.send('hello world');
});

app.listen(5000);