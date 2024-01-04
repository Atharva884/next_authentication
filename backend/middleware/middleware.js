const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{5,20}$/;
const nameRegex = /^[A-Za-z]{3,20}$/;
const pinCodeRegex = /^[0-9]{6}$/;
const mobileNoRegex = /^[0-9]{10}$/;

// Validation middleware
exports.validateAccountSignUp = (req, res, next) => {
  try {
    const { accountFirstName, accountLastName, accountEmail, accountPassword } =
      req.body;

    if (
      accountFirstName.trim().length === 0 ||
      accountLastName.trim().length === 0 ||
      accountEmail.trim().length === 0 ||
      accountPassword.trim().length === 0
    ) {
      return res.status(422).json({ message: "Empty Fields are not allowed" });
    } else {
      if (!nameRegex.test(accountFirstName)) {
        return res.status(422).json({ message: "First Name must be valid" });
      }
      if (!nameRegex.test(accountLastName)) {
        return res.status(422).json({ message: "Last Name must be valid" });
      }
      if (!emailRegex.test(accountEmail)) {
        return res.status(422).json({ message: "Please Enter valid email" });
      }
      if (!passwordRegex.test(accountPassword)) {
        return res.status(422).json({ message: "Please Enter valid password" });
      }
    }

    // If validation is successful, proceed to the main controller logic
    next();
  } catch (error) {
    return res.status(400).json({ message: "An Error Occured" });
  }
};

exports.validateAccountSignIn = (req, res, next) => {
  try {
    const { accountEmail, accountPassword } = req.body;

    if (
      accountEmail.trim().length === 0 ||
      accountPassword.trim().length === 0
    ) {
      return res.status(422).json({ message: "Empty Fields are not allowed" });
    } else {
      if (!emailRegex.test(accountEmail)) {
        return res.status(422).json({ message: "Please enter a valid email" });
      }
      // if(!passwordRegex.test(userPassword)){
      //     return res.status(422).json({message: "Please enter a valid password"})
      // }
    }

    // If validation is successful, proceed to the main controller logic
    next();
  } catch (error) {
    return res.status(400).json({ message: "An Error Occured" });
  }
};

// Calculate Age
function calculateAge(dateOfBirth) {
  // Parse the date of birth to ensure it is a valid date object
  const dob = new Date(dateOfBirth);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years
  let age = currentDate.getFullYear() - dob.getFullYear();

  // Adjust the age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

// Profile validation
exports.validateProfile = (req, res, next) => {
  try {
    const {
      professionalRole,
      title,
      company,
      location,
      startDate,
      endDate,
      description,
      school,
      degree,
      field,
      educationStartDate,
      educationEndDate,
      bio,
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
      certificateName,
      certificateImage,
      dateOfBirth,
      address,
      pinCode,
      // mobileNo,
      profileImage,
    } = req.body;
    console.log(startDate);
    console.log(endDate);

    if (
      professionalRole.trim().length == 0 ||
      school.trim().length == 0 ||
      degree.trim().length == 0 ||
      field.trim().length == 0 ||
      bio.trim().length == 0 ||
      address.trim().length == 0
    ) {
      return res.status(422).json({ message: "Fields cannot be empty" });
    }
    if (
      title.trim().length != 0 ||
      company.trim().length != 0 ||
      location.trim().length != 0
    ) {
      // Means the user is trying to fill the workexperience

      if (description.trim().length > 100) {
        return res
          .status(422)
          .json({ message: "Description cannot be greater than 100" });
      }
      if (new Date(endDate) <= new Date(startDate)) {
        return res.status(422).json({
          message: "Please be sure the start date is not after the end date.",
        });
      }
      if (title.trim().length < 3 && title.trim().length > 50) {
        return res.status(422).json({ message: "Provide a valid title" });
      }
      if (company.trim().length < 3 && company.trim().length > 50) {
        return res
          .status(422)
          .json({ message: "Provide a valid company name" });
      }
      if (location.trim().length < 3) {
        return res.status(422).json({ message: "Provide a valid location" });
      }
    }
    if (school.trim().length < 3 || school.trim().length > 50) {
      return res
        .status(422)
        .json({ message: "Please enter a valid school name" });
    }
    if (degree.trim().length < 3 || degree.trim().length > 10) {
      return res.status(422).json({
        message: "Please enter a valid degree",
      });
    }
    if (field.trim().length < 3 || field.trim().length > 20) {
      return res.status(422).json({
        message: "Please enter a valid field",
      });
    }
    if (new Date(educationEndDate) <= new Date(educationStartDate)) {
      return res.status(422).json({
        message: "Please be sure the start date is not after the end date.",
      });
    }
    if (bio.trim().length < 10) {
      return res
        .status(422)
        .json({ message: "Bio must be atleast 100 characters long" });
    }
    if (
      projectName.trim().length != 0 ||
      projectDescription.trim().length != 0
    ) {
      if (projectName.trim().length < 3 || projectName.trim().length > 50) {
        return res
          .status(422)
          .json({ message: "Project name should be valid" });
      }
      if (
        projectDescription.trim().length < 3 ||
        projectDescription.trim().length > 500
      ) {
        return res
          .status(422)
          .json({ message: "Project description should be valid" });
      }
      if (projectEndDate <= projectStartDate) {
        return res.status(422).json({
          message: "Please be sure the start date is not after the end date.",
        });
      }
    }

    // if (certificateName.trim().length != 0) {
    //   if (certificateImage == null) {
    //     return res.status(422).json({ message: "Image is required ss" });
    //   }
    // }
    if (calculateAge(dateOfBirth) < 18) {
      return res.status(422).json({ message: "You are not eligible to work" });
    }
    if (address.trim().length < 3 || address.trim().length > 50) {
      return res.status(422).json({ message: "Please enter a valid address" });
    }
    if (!pinCodeRegex.test(pinCode)) {
      return res.status(422).json({ message: "Please enter a valid pincode." });
    }
    // if (!mobileNoRegex.test(mobileNo)) {
    //   return res
    //     .status(422)
    //     .json({ message: "Please enter a valid mobile no." });
    // }
    // if (profileImage == null) {
    //   return res.status(422).json({ message: "Please enter a valid image." });
    // }
    // }

    // If validation is successful, proceed to the main controller logic
    next();
  } catch (error) {
    return res.status(400).json({ message: "An Error Occured" });
  }
};

exports.validateAdminLogin = (req, res, next) => {
  try {
    const { adminUsername, adminPassword } = req.body;

    if (
      adminUsername.trim().length === 0 ||
      adminPassword.trim().length === 0
    ) {
      return res.status(422).json({ message: "Empty Fields are not allowed" });
    }
    // else {
    // if (!emailRegex.test(accountEmail)) {
    //   return res.status(422).json({ message: "Please enter a valid email" });
    // }
    // // if(!passwordRegex.test(userPassword)){
    // //     return res.status(422).json({message: "Please enter a valid password"})
    // // }
    // }

    // If validation is successful, proceed to the main controller logic
    next();
  } catch (error) {
    return res.status(400).json({ message: "An Error Occured" });
  }
};
