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
app.post('/users', async (req, res) => {
    
    try{
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
                    return res.status(400).send('User already exists.');
                }else{
                    user.save((err, res) => {
                        if(err){
                            console.log(err);
                        }else{
                            res.status(201).send();
                        }
                        
                    });
                }
            }
        })
    }catch{
        res.status(500).send();
    }
});

// API Route to try to login a user
app.post('/users/login', async (req, res) => {
    User.find({username:req.body.username},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result){
                try{
                    if(bcrypt.compare(req.body.password, user.password)) { //Comparing the password of user and entered password
                        res.send('Success')
                    } else {
                        res.send('Wrong Password')
                    }
                }catch{
                    res.status(500).send()
                }
            }else{
                user.save((err, res) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.status(201).send()
                    }
                    
                });
            }
        }
    })
    
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000.")
})