import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  firstName: {
    type: String,
    unique: true,
    required: [true, "First name is required"],
    minlength: [3, "First name should contain at least 3 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [3, "Last name should contain at least 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [10, "Phone number must contain exactly 10 digits"],
    maxlength: [10, "Phone number must contain exactly 10 digits"],
    match: [/^\d{10}$/, "Phone number must contain exactly 10 digits"], // Regex to ensure exactly 10 digits
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    minlength: [12, "Enter proper aadhar number"],
    maxlength: [12, "Enter proper aadhar number"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is required"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Others"],
  },
  password: {
    type: String,
    select: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Doctor", "Patient"],
  },
  doctorDepartment: {
    type: String,
  },
  avatar: {
    type: String,
  },
  token: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  if (!this.isModified("password")) return next();

  try {
    // Hash the new password
    this.password = await bcrypt.hash(this.password, 10);
    // Proceed to the next middleware or save operation
    next();
  } catch (error) {
    // Pass any errors to the global error handler
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error comparing password:" + error);
  }
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
