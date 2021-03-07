const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
{

username :{ type: String, required: true, unique: true},
password:{type: String,required: true},
name:{type: String,required: true},
designation:{type: String,required: true},
age:{type: String,required: true}


},
{collection: 'users'}
)

const model = mongoose.model('UserSchema',UserSchema) 
module.exports = model