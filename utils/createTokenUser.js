const createUserToken = (user)=> {
    // console.log(user, "user")
    return { name: user.name, userId: user._id, role: user.role }
}

module.exports = {createUserToken}