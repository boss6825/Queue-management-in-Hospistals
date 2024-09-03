export const generateToken = (user, message, statusCode, res) => { //sends user, message, statusCodeand res
  const token = user.generateJsonWebToken();  
  // Determine the cookie name based on the user's role
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';   //if user's role is admin then provide admintoken otherwise provide usertoken

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000  // makes cookie expire after 7 days
      ),
      httpOnly: true, 
    })
    .json({          
      success: true,
      message,
      user,
      token,
    });
};

