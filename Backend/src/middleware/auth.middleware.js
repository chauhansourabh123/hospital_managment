import User from "../modal/user.modal.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isAdminAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.adminCookie || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new apiError(401, "Authentication token not provided.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new apiError(403, "Invalid or expired authentication token.");
    }

    const user = await User.findById(decodedToken._id);

    if (!user || user.role !== "Admin") {
      throw new apiError(403, "Access denied. Admin role is required.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
});
const isPatientAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.patientCookie || req.headers.authorization?.split(' ')[1];


    if (!token) {
      throw new apiError(401, "Authentication token not provided.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new apiError(403, "Invalid or expired authentication token.");
    }

    const user = await User.findById(decodedToken._id);

    if (!user || user.role !== "Patient") {
      throw new apiError(403, "Access denied. Patient role is required.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
});

export { isAdminAuthenticated, isPatientAuthenticated };
