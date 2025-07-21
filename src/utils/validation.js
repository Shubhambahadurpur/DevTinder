const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;
  if (!firstName || !lastName) throw new Error("Name is not valid");
  else if (!emailId) throw new Error("Email is mandatory");
  else if (!validator.isEmail(emailId)) throw new Error("Email is not valid");
  else if (!password) throw new Error("Password is mandatory");
  else if (!validator.isStrongPassword(password))
    throw new Error("Password is not strong");
};

const validateUpdateProfileData = (req) => {
    const ALLOWED_FEILDS = ["about", "skills", "profilePhoto", "age"];
    const IS_ALLOWED = Object.keys(req.body)?.every((element) =>
      ALLOWED_FEILDS?.includes(element)
    );
    if (!IS_ALLOWED) {
      throw new Error("Update not allowed.");
    }
    return true;
}

module.exports = {
  validateSignUpData,
  validateUpdateProfileData
};
