export const validateError = (fields) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  fields.forEach((field) => {
    if (field.name === "email") {
      // Check for email validity
      if (!field.value) {
        errors.email = "Required";
      } else if (!emailRegex.test(field.value)) {
        errors.email = "This is not a valid email format";
      }
    } else {
      // For all other fields, check if they are empty
      if (!field.value) {
        errors[field.name] = "Required";
      }
    }
  });

  return errors;
};
