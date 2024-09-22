import { OPTIONS } from "../constants.js";
import User from "../modal/user.modal.js";
import apiError from "../utils/apiError.js";
import Response from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwtTokens from "../utils/jwttoken.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadhar,
    dob,
    gender,
    password,
    role,
  } = req.body;

  if (
    [
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      password,
      role,
    ].some((field) => !field?.trim())
  ) {
    return next(new apiError(400, "All fields are required"));
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw new apiError(401, "User already exist");
    }

    user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      password,
      role,
    });

    if (!user) {
      throw new apiError(500, "Error in creating user. Please Register again");
    }

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new apiError(500, "Error in creating user. Please Register again");
    }

    await jwtTokens(createdUser, 200, "Register Successfully", res);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res
      .status(error.statusCode || 500)
      .json(new Response(false, error.message || "Internal server error"));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    throw new apiError(401, "All fields are required");
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new apiError(404, "User with this email not found");
    }

    if (password !== confirmPassword) {
      throw new apiError(400, "Passwords do not match.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new apiError(401, "Invalid email or password.");
    }

    if (role !== user.role) {
      throw new apiError(401, "Unauthorized role.");
    }

    const loggedUser = await User.findById(user._id).select("-password");

    await jwtTokens(loggedUser, 200, "login successfully", res);
  } catch (error) {
    console.error("Error during user login:", error);
    return res
      .status(error.statusCode || 500)
      .json(new Response(false, error.message || "Internal server error"));
  }
});

const signupNewAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, aadhar, dob, gender, password } =
    req.body;

  if (
    [firstName, lastName, email, phone, aadhar, dob, gender, password].some(
      (field) => !field.trim()
    )
  ) {
    throw new apiError(400, "All fields are required");
  }

  try {
    const isExistAdmin = await User.findOne({ email });

    if (isExistAdmin) {
      throw new apiError(
        401,
        `${isExistAdmin.role} with this email is already exist`
      );
    }

    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      password,
      role: "Admin",
    });

    if (!admin) {
      throw new apiError(400, "Error occurred while creating admin");
    }

    return jwtTokens(admin, 200, "Admin Registered successfully", res);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json(new Response(500, "Internal Server Error"));
  }
});

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" });

    if (!doctors) {
      throw new apiError(400, "Error while getting the data of doctors");
    }

    res
      .status(200)
      .json(new Response(200, "Doctor Feched successfully", doctors));
  } catch (error) {
    console.log(error);
  }
});

const userDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(401, "Unauthorized request");
  }

  return res
    .status(200)
    .json(new Response(200, "User fetched successfully", user));
});

const logoutPatient = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== "Patient") {
    throw new apiError(401, "Patient not authenticated");
  }

  return res
    .status(200)
    .clearCookie("patientCookie", OPTIONS)
    .json(new Response(200, "User Logout Successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== "Admin") {
    throw new apiError(401, "Invalid request");
  }
  return res
    .status(200)
    .clearCookie("adminCookie", OPTIONS)
    .json(new Response(200, "User Logout Successfully"));
});

const addNewDoctor = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      doctorDepartment,
    } = req.body;

    // Check if all required fields are provided and not empty
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !aadhar.trim() ||
      !dob.trim() ||
      !gender.trim() ||
      !doctorDepartment.trim()
    ) {
      return res
        .status(400)
        .json(new apiError(400, "All fields are required."));
    }

    // Check if a doctor with the provided email already exists
    const isExistingDoctor = await User.findOne({ email });

    if (isExistingDoctor) {
      return res
        .status(400)
        .json(new apiError(400, "Doctor with this email already exists."));
    }

    // Upload avatar to Cloudinary
    const filePath = req.file.path;
    
    if(!filePath){
      throw new apiError(400, "Avatar not found try again.")
    }
    
    const cloudAvatar = await uploadOnCloudinary(filePath);

    if (!cloudAvatar) {
      return res
        .status(500)
        .json(new apiError(500, "Failed to upload avatar. Please try again."));
    }

    // Create a new doctor
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      doctorDepartment,
      avatar: cloudAvatar.secure_url,
      role: "Doctor",
    });

    return res
      .status(200)
      .json(new Response(200, "Doctor created successfully",  doctor, true));
  } catch (error) {
    console.error(error);
  }
});

export {
  logoutAdmin,
  logoutPatient,
  registerUser,
  loginUser,
  signupNewAdmin,
  getAllDoctors,
  userDetails,
  addNewDoctor,
};

// return res.status(200).json(new Response(200, "Login successfully", loggedUser));
