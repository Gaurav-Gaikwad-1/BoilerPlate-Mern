//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./models/user');
const { auth } = require('./middleware/auth');


//connect to database

mongoose.connect(config.mangoURI, 
                    {useUnifiedTopology: true,useNewUrlParser : true}).then(() => console.log('DB connected'))
                                            .catch(err => console.error(err));


app.use(bodyParser.urlencoded({ extended : true })); 
app.use(bodyParser.json());             //to read json files
app.use(cookieParser());             

//Routing

//this is get request bcoz we do not put any data here
//after logging in we need to get authenticated by website
app.get('/api/user/auth',auth, (req,res)=>{
    res.status(200).json({
        _id:req._id,
        isAuth: true,
        email: req.user.email,
        name:req.user.name,
        lastName:req.user.lastName,
        role:req.user.role
    })
})

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
//whenever user tries to login this route is called which returns | loginSucces:True | upon successful logging & generates a token which is stored in 'x_auth'
// & then we do authorization check which is at route | api/user/auth |
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

//Logout routing we jst have to remove token from cookie to get user log out
//but before logout we need to be authenticated so we pass 'auth' from which only we can get 'req.user._id' 
//we can also see in database mangodb whenever user is logged in we have token & when we logout token is not available

//when athorizing the user with token,    in client we put that in cookie and in server we put that in database   so   we 
//compare that token from cookie and database !   but  if we dont have a token inside the database,  that comparison will fail, 
// so  it will be logged out
app.get('api/user/logout',auth,(req,res) => {
    User.findOneAndUpdate({_id:req.user._id},{ token:"" },(err,doc) => {              //here we need to find specific logged in user Id to let that acc kicked out of website
        if(err) return res.json({ success:false, err});

        return res.status(200).send({
            success:true
        });
    });                                              
});

// if port is set by heroku take that othrwise listen to 5000
const port = process.env.PORT || 5000 ;                    //process.env.port means port set by heroku 

app.listen(port,()=>{
    console.log(`App running on server ${port}`);
});