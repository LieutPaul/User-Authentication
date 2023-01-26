const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users) //Get all registered Users
});

// API Route to create a user
app.post('/users', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10) //Hashing the password with 10 salt rounds
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user) // Adding user to list of users
        res.status(201).send()
    }catch{
        res.status(500).send()
    }
});

// API Route to try to login a user
app.post('/users/login', async (req, res) => {
    let user = null;
    for(var i=0;i<users.length;i++){ //Finding the username
        if(users[i].name===req.body.name){
            user = users[i];
        }
    }
    if(user==null){
        return res.status(400).send('Cannot find user') //User doesn't exist
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)) { //Comparing the password of user and entered password
            res.send('Success')
        } else {
            res.send('Wrong Password')
        }
    }catch{
        res.status(500).send()
    }
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000.")
})