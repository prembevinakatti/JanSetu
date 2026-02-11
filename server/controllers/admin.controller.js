module.exports.adminregister=async(req,res)=>{
    try {
        const {fullname,email,phone,password}=req.body;
        if(!fullname||!email||!phone||!password){
            return res.status()
        }


        
    } catch (error) {
        console.log("Failed to registrer")
        return res.status(500).json({message:"Error in registering"})
    }
}