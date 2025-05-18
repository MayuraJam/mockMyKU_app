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
  if(error.message === "incorrect studentID"){
    return {massage:"that studentID isn't correct"}
  }
   if(error.message === "incorrect InstrutorID"){
    return {massage:"that InstrutorID isn't correct"}
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

  if (error.message.includes("Student validation failed")) {
    const errors = {};
    Object.values(error.errors).forEach((propError) => {
      const { path, message } = propError.properties;
      errors[path] = message;
    });
    return {massage : "Student validation failed",errors};
  }

};

module.exports = { handleError };
