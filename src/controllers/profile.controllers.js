import cloudinary from "../lib/cloudinary"
import User from "../models/auth.models"

export const profileUpload = async (req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(401).json({message:"Profile Picture is Required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate
        (userId,
            { profilePic:uploadResponse.secure_url },
            {new:true}
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}