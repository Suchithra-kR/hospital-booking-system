import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'


//API to register user
const registerUser = async (req,res) =>{
    try {
        const {name, email, password } = req.body

        //if any o fthe property empty ,we will terminate the function
        if (!name || !password || !email) {
            return res.json({success:false,message:"Missing Details"})  
        }

        //validating email
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Enter a valid email"})          
        }

        //validating password
        if (password.length < 8) {
            return res.json({success:false,message:"Enter a strong password"})  
        
        }
          //hashing user password
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password,salt)

          //saved hp into db
          const userData ={
            name,
            email,
            password : hashedPassword
          }

          const newUser = new userModel(userData)
          //save new user into db
          const user = await newUser.save()
          
          //create a token
          const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    
          res.json({success:true,token})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
   
        
    }
}

//api for user login

const loginUser = async (req,res) =>{
    try {

        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
           return  res.json({success:false,message:'User does not exist'}) 
        }

        const isMatch = await bcrypt.compare(password,user.password)
        
        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }
        
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
   
    }
}

//API to get user profile data

const getProfile = async (req,res)=>{
   try {

      const { userId } = req.user
      const userData = await userModel.findById(userId).select('-password')
      
      res.json({success:true,userData})
    
   } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})

   }
}

//api to update the userProfile

const updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId; // ✅ fixed line
      const { name, phone, address, dob, gender } = req.body;
      const imageFile = req.file;
  
      if (!name || !phone || !dob || !gender) {
        return res.json({ success: false, message: "Data Missing" });
      }
  
      const updatedData = {
        name,
        phone,
        dob,
        gender,
        address: address ? JSON.parse(address) : undefined,
      };
  
      // ✅ Upload image to Cloudinary if present
      if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        updatedData.image = imageUpload.secure_url;
      }
  
      // ✅ Save all updates in one query
      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
        new: true, // returns updated document
        runValidators: true, // ensure schema rules apply
      });
  
      if (!updatedUser) {
        return res.json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, message: "Profile Updated", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
//API TO book appointment

const bookAppointment = async(req,res)=>{

  try {
    const{userId, docId, slotDate, slotTime } = req.body
    const docData = await doctorModel.findById(docId).select('-password')
   
    //if doc is available or not to booking
    if (!docData.available) {
      return res.json({success:false,message:'Doctor is not available'})     
    }
  
  //get slots booking data from the doctor data 
  let slots_booked = docData.slots_booked

  //checking for slots availability
  if (slots_booked[slotDate]) {
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({success:false,message:'Slot not available'}) 
    }else{
      slots_booked[slotDate].push(slotTime)
    }  
  }else{
    slots_booked[slotDate] = []
    slots_booked[slotDate].push(slotTime)
  }
  const userData = await userModel.findById(userId).select('-password')
  delete docData.slots_booked

  const appointmentData = {
    userId,
    docId,
    userData,
    docData,
    amount:docData.fees,
    slotTime,
    slotDate,
    date: Date.now()
  }

  //save the data into database
  const newAppointment = new appointmentModel(appointmentData)
  await newAppointment.save()

  //save new slots data in docData
  await doctorModel.findByIdAndUpdate(docId,{slots_booked})

  res.json({success:true,message:'Appointment Booked'})
  
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  
  }
}
export {registerUser,loginUser, getProfile, updateProfile, bookAppointment}