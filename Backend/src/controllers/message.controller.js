import Message from "../modal/message.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import Response from "../utils/apiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    throw new apiError(400, "All fields are required");
  }

  try {
    // Create a new message
    const sentMessage = await Message.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    // Check if the message was created successfully
    if (!sentMessage) {
      throw new apiError(
        400,
        "Failed to create the message. Please try again."
      );
    }

    // Respond with success if the message was created
    return res
      .status(200)
      .json(new Response(200, "Message Send successfully", {}, true));
  } catch (error) {
    // Handle server errors
    console.error("Error creating message:", error.message);
    throw new apiError(500, "An error occurred while creating the message");
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();

  return res
    .status(200)
    .json(new Response(200, "All messages fetched", messages, true));
});

export { sendMessage, getAllMessages };
