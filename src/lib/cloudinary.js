import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name:CLOUDINARY_CLOUD_NAME,
    api_key:CLOUDINARY_API_NAME,
    api_secret:CLOUDINARY_API_SECRET
})

export default cloudinary