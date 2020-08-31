//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require('./models/user');
const { json } = require('body-parser');

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
        if(err)  
            return res.json({ success:false, err})                          //if error occurs

        return res.status(200).json({                       //returning succes status 
            success:true        
        });                
    })

   
})

//function def for comparePassword,generateToken is written in user.js

app.post('/api/user/login', (req,res) => {
    //find the email
    User.findOne({ email: req.body.email }, (err,user) => {
        if(!user)
            return res.json({
                loginSuccess:false,
                message:'Auth failed,email not found'
            });
        
        //compare password
        user.comparePassword(req.body.password , (err,isMatch) => {
            if(!isMatch)
                return res.json({
                    loginSuccess:false,
                    message:'password wrong'
                });
        });

        //generate Token
        user.generateToken((err,user) => {
            if(err) return res.status(400).send(err);   //if functn called in user.js returns error then send error code & response as error
            res.cookie('x_auth',user.token)             //if successfull then token we put token we made into cookie
                .status(200)
                .json({
                    loginSuccess:true
                })
        });



    })
})
   

app.listen(5000);