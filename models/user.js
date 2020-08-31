const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;           //seting characters to encryypt
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique: 1
    },
    password: {
        type:String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength: 50
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String,
    },
    tokenExp:{
        type:Number
    }
})

//for hashing password
userSchema.pre('save',function(next){                         //this means before saving our info
    var user = this;   //here this means userSchema

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if (err)
                return next(err);
            bcrypt.hash(user.password,salt,function(err,hash){                    //hash is generated hashing password
                if(err)
                  return next(err);
                user.password=hash;
                next();
            });
        });
    } else{
        next();
    }
});

//cb -> callback functions -> (err,isMatch)
userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secret')

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user);
    })
}

const User = mongoose.model('User',userSchema); //User is name of collection tat we want to create

module.exports = { User }