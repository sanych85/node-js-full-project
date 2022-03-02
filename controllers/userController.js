const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {createUserToken, attachCookiesToResponse,checkPermissons } = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ _id: id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id ${id}`);
  }
  console.log("user", user)
  console.log( "req.user",req.user)
  checkPermissons(req.user, user._id)
  // console.log("user" ,user)
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//update user wuth findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );

//   const tokenUser = createUserToken(user)
//   attachCookiesToResponse({res, user:tokenUser})
//   res.status(StatusCodes.OK).json({user: tokenUser})
// };


//update user with user.save
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide values');
  }
  // const user = await User.findOneAndUpdate(
  //   { _id: req.user.userId },
  //   { email, name },
  //   { new: true, runValidators: true }
  // );
  const user = await User.findOne({_id: req.user.userId})
   user.email = email
   user.name = name
  await user.save()
   
 
  const tokenUser = createUserToken(user)
  attachCookiesToResponse({res, user:tokenUser})
  res.status(StatusCodes.OK).json({user: tokenUser})
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const user = await User.findOne({ id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
