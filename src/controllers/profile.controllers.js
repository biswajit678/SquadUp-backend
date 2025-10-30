import cloudinary from "../lib/cloudinary"
import User from "../models/auth.models"

export const profileUpload = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) {
            return res.status(401).json({ message: "Profile Picture is Required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate
            (userId,
                { profilePic: uploadResponse.secure_url },
                { new: true }
            )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bio, location, sports } = req.body;

        const user = await User.findById(userId)
            .select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not Exist"
            })
        }

        if (bio !== undefined) user.bio = bio;
        if (location) user.location = location;
        if (sports) user.sports = sports;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            data: updatedUser
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }

}

const setAvailability = async (req, res) => {
    try {
        const userId = req.user._id;
        const { availability } = req.body;

        const validStatuses = ["Available", "Busy", "Not Available"];;
        if (!availability || !validStatuses.includes(availability)) {
            return res.status(400).json({
                success: false,
                message: "Invalid availability status"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { availability },
            { new: true, runValidators: true, select: "name email availability" }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not Exist"
            })
        }

        return res.status(200).json({
            success: true,
            data: {
                availability: updatedUser.availability,
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}