export default class ErrorHandler extends Error { //potential br point , i resolved it by adding export default to class
   constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;;

   }
}
   

export const errorMiddleware = (err, req, res, next) => {
   err.message = err.message || "Internal server error"; //if err message is empty then send internal server error
   err.statusCode = err.statusCode || 500 ; //if err status code is not got then send 500
   if(err.code === 11000){ //err code 11000 comes when two inputted values are same like two people inputted same emails
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`; //duplicate and entered ke beech mei jo duplicate value dali hai vo aa jayegi
      err = new ErrorHandler(message, 400);
      
   } 
   if(err.code === "JsonWebTokenError"){
      const message = "Json web token is invalid, Try again!"; 
      err = new ErrorHandler(message, 400);
   }
   if(err.code === "TokenExpiredError"){
      const message = "Json web token is expired, Try again!"; 
      err = new ErrorHandler(message, 400);
   }
   if(err.code === "CastError"){ //if data entered does not matches the type
      const message = `Invalid ${err.path}`; 
      err = new ErrorHandler(message, 400);
   }

   const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;



   return res.status(err.statusCode).json({
      success:false,
      message: errorMessage,
   });
};