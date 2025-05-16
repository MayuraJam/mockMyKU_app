//handle Error
const handleError = (error) => {
  console.log(error.message, error.code);

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
