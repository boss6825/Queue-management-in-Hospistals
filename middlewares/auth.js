import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";               //br point for errors handling thus commented out currently,might fix it in future versions
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {                  // checks if token is admin token not some other role token
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //this code performs authorization and authentication in the same function  
    req.user = await User.findById(decoded.id); //uses id from userschema line no. 75
    if (req.user.role !== "Admin") { //if role is not admin 
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);

// Middleware to authenticate frontend users
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    next();
  };
};
