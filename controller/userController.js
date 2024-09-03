import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body); // Added this line for debugging
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !dob ||
    !nic ||
    !gender
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User login successfully!", 200, res); //passing user, message, statusCode, res in this
});

export const login = catchAsyncErrors(async (req, res, next) => {
  //this login constant is exportd to userRouter.js
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    // these things are must ,if any goes missing ,throws error
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    //matches entered and confirming passwords
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password"); //finds the user
  if (!user) {
    //if user not found,throws errors
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password); //matches password with entered pass
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    //matches role with users existing role,on failure throws error
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email }); // RETURnS error if same email is gaian used for registration
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} With This Email Already Exists!`,
        400
      )
    );
  }

  const admin = await User.create({
    //creates admin account
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {           // 404
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"]; //const allowedFormats = ["image/png", "image/jpeg", "image/webp"]; defines an array of MIME types that are acceptable for the uploaded file. 
  if (!allowedFormats.includes(docAvatar.mimetype)) {              //!allowedFormats.includes(docAvatar.mimetype) checks if the MIME type of the uploaded file (docAvatar.mimetype) is not included in the allowedFormats array.
    return next(new ErrorHandler("File Format Not Supported!", 400)); //!allowedFormats.includes(docAvatar.mimetype) checks if the MIME type of the uploaded file (docAvatar.mimetype) is not included in the allowedFormats array.
  }
  const {                                  //
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (                            //if any of them is missing return error
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });             //checks if the user is already registered with the provided emial
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);  //method to upload image in cloudinary (more deatil given in doc of this on notion)
  if (!cloudinaryResponse || cloudinaryResponse.error) {      //if cloudinary not responding or responds with error then throw error
    console.error("Cloudinary Error:",cloudinaryResponse.error || "Unknown Cloudinary error"); //logging error
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500) //showing error
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({          //responds a json with doctor details
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});



export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" }); //finds users with role "Doctor"
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user; //in auth.js on line 34 req.user is defined
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.status(201).cookie("adminToken", "", {    //to logout we pass null string in admin token ("") and reset the date to the current date TO MAKE IT EXPIRE
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {   //in similar way of admin , patient is made to logout
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
