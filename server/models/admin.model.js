const { default: mongoose } = require("mongoose");
const bcrypt=require("bcrypt");

const adminSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

adminSchema.pre("save",async function(){
    if(!this.isModified("password"))return
    const hash=await bcrypt.hash(this.password,10)
    this.password=hash;
});

module.exports=mongoose.model("Admin",adminSchema);

