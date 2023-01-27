const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userAuthenticationDB",{useNewURLParser:true});

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
});
const User = mongoose.model("User",UserSchema);

app.use(express.json())

app.get('/users', (req, res) => {
    //Get all registered Users
    User.find({},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
});

// API Route to create a user
app.post('/register', async (req, res) => {
    // Adding user to list of users
    const hashedPassword = await bcrypt.hash(req.body.password,10) //Hashing the password with 10 salt rounds
    const user = new User({ 
        name: req.body.name, 
        username:req.body.username, 
        password: hashedPassword 
    });
    console.log(user);
    User.find({username:req.body.username},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length !== 0){
                res.status(400).send('User already exists.');
            }else{
                user.save((err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.status(201).send("User Added");
                    }
                    
                });
            }
        }
    })
    
});

// API Route to try to login a user
app.post('/login', async (req, res) => {
    User.findOne({username:req.body.username},(err,user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){ //Comparing passwords
                bcrypt.compare(req.body.password, user.password, (err, data) => {
                    if(err){
                        console.log(err);
                    }
                    if(data){
                        return res.status(200).send("Successful Login")
                    } else {
                        return res.status(401).send("Wrong Password")
                    }
                });
            }else{
                res.status(404).send("User does not exist.")
            }
        }
    })
    
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000.")
})