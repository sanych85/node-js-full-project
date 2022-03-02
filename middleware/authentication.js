const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Auth invalid');
  }
  try {
    const {name,userId, role} = isTokenValid({ token });
    req.user = {name, userId, role}
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError('Auth invalid');
  }


};

const authorizePermissions = (...roles)=> {
    return (req, res, next)=> {
            // forbidden to all except admin and or owner
        if(!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route')
        }
        next()
    }


}
module.exports = {
  authenticateUser,
  authorizePermissions
};
