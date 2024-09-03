import {Message} from "../models/messageSchema.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js" // potential break point causing error 
// 1:08 hr 

export const sendMessage =catchAsyncErrors(async (req, res,next)=> {
    const{firstName, lastName, email, phone, message} = req.body;//gets this from req body
    if(!firstName || !lastName || !email || !phone || !message){//if any of these are missing from the message ,it will return error message 
        return next(new ErrorHandler("please fill full form, 400"));
    }
        
    await Message.create({firstName, lastName, email, phone, message});
    res.status(200).json({
            success:true,
            message:"message sent successfully!",
    });
    
});


export const getAllMessages = catchAsyncErrors(async (req, res, next) => { //this messages can be sent by anyone without authentication
    const messages = await Message.find();  //Message.find() is a Mongoose query method that retrieves all documents from the Message collection in your MongoDB database.
    res.status(200).json({
      success: true,
      messages,
    });
  });
  