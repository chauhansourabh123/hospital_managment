import User from "../modal/user.modal.js"
import apiError from "../utils/apiError.js";
import Response from "../utils/apiResponse.js";
import Appointment from "../modal/appointment.model.js"
import asyncHandler from "../utils/asyncHandler.js";

const appointment = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadhar,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  
  const requiredFields = [
    firstName, lastName, email, phone, aadhar, dob, gender,
    appointment_date, department, doctor_firstName, doctor_lastName,
    address,
  ];
 
  if (requiredFields.some(field => !field || field.trim() === "")) {
    throw new apiError(401, "All fields are required.");
  }

  try {
    const doctor = await User.find({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Doctor",
      doctorDepartment: department,
    });

    if (!doctor) {
      throw new apiError(402, "Doctor not find");
    }

    if (doctor.length === 0) {
      throw new apiError(403, "Doctor not find with your details");
    }

    if (doctor.length > 1) {
      throw new apiError(401, "Doctor find more than one.Try again");
    }

    const doctorId = doctor[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      aadhar,
      dob,
      gender,
      appointment_date,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      hasVisited,
      doctorId,
      patientId,
      address,
    });

    if (!appointment) {
      throw new apiError(402, "Appointment not created. Try again");
    }

    return res
      .status(200)
      .json(new Response(200, "Appointment created", appointment, true));
  } catch (error) {
    console.error(error);
  }
});

const getAllAppointment = asyncHandler(async (req, res) => {
  try {
    const allAppointments = await Appointment.find();

    if (allAppointments.length === 0) {
      return res
        .status(404)
        .json(new Response(404, "No appointments found", [], true));
    }

    return res
      .status(200)
      .json(
        new Response(200, "All appointments fetched", allAppointments, true)
      );
  } catch (error) {
    console.log(error);
  }
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updateAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!updateAppointment) {
      throw new apiError(401, "Error updating appointment status.");
    }

    return res
      .status(200)
      .json(
        new Response(
          200,
          "Updated status successfully",
          updateAppointment,
          true
        )
      );
  } catch (error) {
    console.error(error);
  }
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndDelete(id);

    return res.status(200).json(new Response(200, "Deleted", [], true));
  } catch (error) {
    console.error(error);
  }
});

export {
  appointment,
  getAllAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
