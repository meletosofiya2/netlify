console.log('jhjujh');
const express = require('express')
const path=require('path');
const bodyParser= require('body-parser')
const mongoose=require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const JWT_SECRET='gffhfhfhgvcvbdvyudefnasdnjkyb'

mongoose.connect('mongodb://localhost:27017/firstmongo',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})

const app=express()
app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

app.post('/api/login', async (req,res) =>
{

    const {username,password} =req.body

    const user = await User.findOne({username}).lean()//simple object representation of document
   

   if(!user)
   {
       return res.json({status:'error',error:'Invalid usernamr/password'})
   }


    if( await bcrypt.compare(password,user.password))
    {
        
       const token = jwt.sign({
           id: user._id,
           username:user.username
        
        },
        
        JWT_SECRET
        
        )

        return res.json(
            {status:'ok',data:'token'})

    }

res.json({status:'error',error:'Invalid usernamr/password'})



})




app.post('/api/register',async (req,res) =>
{
console.log(req.body)   
 
const {username,password : plainTextPassword,name,designation,age} = req.body

if(!username || typeof username!== 'string')
{
    return res.json({status:'error',error: 'Invalid username'})
}



if(!age || typeof age!== 'string')
{
    return res.json({status:'error',error: 'age Required'})
}


if(!name || typeof name!== 'string')
{
    return res.json({status:'error',error: 'name Required'})
}


if(!designation || typeof designation!== 'string')
{
    return res.json({status:'error',error: 'designation Required'})
}


if(!plainTextPassword || typeof plainTextPassword!== 'string')
{
    return res.json({status:'error',error: 'Invalid password'})
}

if(plainTextPassword.length < 6)
{
    return res.json({status:'error',error: 'Password is not having length 6'})

}


const password = await bcrypt.hash(plainTextPassword,10)
// console.log(await bcrypt.hash(password,10))
//save a record 

try{

  const response=await User.create({
    username,
    password,
    name,
    designation,
   
    age
    })
    console.log('User created sucessfully',response)
}

catch(error){
if(error.code === 11000)
{
return res.json({status:'error',error: 'Username already in use'})
}
throw error 
}


res.json({status: 'ok'}) 
})

app.listen(9998,() => {
    console.log('server up to 9998')
});