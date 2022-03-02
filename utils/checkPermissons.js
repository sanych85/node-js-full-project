const CustomError = require('../errors');

const checkPermissons = (requestUser, resourseUserId) => {
  // console.log(requestUser)
  // console.log( typeof requestUser)
  // console.log(resourseUserId)
  // console.log(typeof resourseUserId)

  //access to the info only for admin or user only to their accaunt
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourseUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'not authorized to access this route'
  );
};

module.exports = { checkPermissons };
