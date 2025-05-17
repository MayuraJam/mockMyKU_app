//handle Error
const handleError = (error) => {
  console.log(error.message, error.code);

  //incorrect email
  if(error.message === 'incorrect email'){
    return {massage:"that email is not registered"};
  }
   //incorrect password
  if(error.message === 'incorrect password'){
    return {massage:"that password is incorrect"};
  }
  //validation error
  if (error.message.includes("User validation failed")) {
    const errors = {};
    Object.values(error.errors).forEach((propError) => {
      const { path, message } = propError.properties;
      errors[path] = message;
    });
    return {massage : "User validation failed",errors};
  }

};

module.exports = { handleError };
