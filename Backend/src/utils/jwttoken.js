import Response from "./apiResponse.js";
import { OPTIONS } from "../constants.js";

const jwtTokens = async function (user, statusCode, message, res) {
  try {
    const token = await user.generateAccessToken();
    const cookieName = user.role === "Admin" ? "adminCookie" : "patientCookie";

    user.token = token;
    await user.save();

    return res
      .status(statusCode)
      .cookie(cookieName, token, OPTIONS)
      .json(new Response(statusCode, message, user, true));
  } catch (error) {
    console.error("Error generating or sending JWT:", error);
  }
};

export default jwtTokens;
