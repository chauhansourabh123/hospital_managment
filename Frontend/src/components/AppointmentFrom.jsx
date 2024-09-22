import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.data);
      } catch (error) {
        toast.error("Failed to load doctors.");
      }
    };
    fetchDoctors();
  }, []);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const department = watch("department");

  const onSubmit = async (data) => {
    try {
      const { data: responseData } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          ...data,
          phone: String(data.phone), // Convert to string: String(data.phone), // Convert to string
          aadhar: String(data.aadhar), // Convert to string: String(data.aadhar), // Convert to string
          dob: String(data.dob), // Convert to string: String(data.dob), // Convert to string
          doctor_firstName: data.doctorFirstName.split(" ")[0],
          doctor_lastName: data.doctorFirstName.split(" ")[1],
          hasVisited: String(data.hasVisited), // Convert to string
          appointment_date: String(data.appointmentDate), // Convert to string
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(responseData.message);
      // Reset the form fields
      Object.keys(data).forEach((key) => {
        setValue(key, key === "hasVisited" ? false : "");
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container">
      <h2>Appointment</h2>
      <form className="appointmentForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="formDiv">
          {/* First Name */}
          <div>
            <label htmlFor="firstName">First Name</label>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <input {...field} type="text" placeholder="First Name" />
              )}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName">Last Name</label>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <input {...field} type="text" placeholder="Last Name" />
              )}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">Email</label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <input {...field} type="email" placeholder="Email" />
              )}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone">Contact</label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: "Phone Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              }}
              render={({ field }) => (
                <input {...field} type="tel" placeholder="Mobile Number" />
              )}
            />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>

          {/* Aadhar */}
          <div>
            <label htmlFor="aadhar">Aadhar card number</label>
            <Controller
              name="aadhar"
              control={control}
              defaultValue=""
              rules={{
                required: "Aadhar is required",
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: "Aadhar must be 12 digits",
                },
              }}
              render={({ field }) => (
                <input {...field} type="text" placeholder="Aadhar" />
              )}
            />
            {errors.aadhar && <p>{errors.aadhar.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob">Date of birth</label>
            <Controller
              name="dob"
              control={control}
              defaultValue=""
              rules={{ required: "Date of Birth is required" }}
              render={({ field }) => <input {...field} type="date" />}
            />
            {errors.dob && <p>{errors.dob.message}</p>}
          </div>

          {/* Gender Selection */}
          <div className="select">
            <label htmlFor="gender">Gender</label>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <select {...field}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              )}
            />
            {errors.gender && <p>{errors.gender.message}</p>}
          </div>

          {/* Appointment Date */}
          <div>
            <label htmlFor="appointmentDate">Appointment Date</label>
            <Controller
              name="appointmentDate"
              control={control}
              defaultValue=""
              rules={{ required: "Appointment Date is required" }}
              render={({ field }) => (
                <input {...field} type="date" placeholder="Appointment Date" />
              )}
            />
            {errors.appointmentDate && <p>{errors.appointmentDate.message}</p>}
          </div>

          {/* Department and Doctor Selection */}
          <div className="departanddoctor">
            <div>
            <label htmlFor="deparment">Department</label>
            <Controller
              name="department"
              control={control}
              defaultValue="Pediatrics"
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => {
                    setValue("department", e.target.value);
                    setValue("doctorFirstName", ""); // Reset doctor selection
                  }}
                >
                  {departmentsArray.map((depart, index) => (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.department && <p>{errors.department.message}</p>}

            </div>
            <div>
            <label>Doctor</label>
            <Controller
              name="doctorFirstName"
              control={control}
              defaultValue=""
              rules={{ required: "Doctor is required" }}
              render={({ field }) => (
                <select {...field} disabled={!department}>
                  <option value="">Select Doctor</option>
                  {doctors
                    .filter((doctor) => doctor.doctorDepartment === department)
                    .map((doctor, index) => (
                      <option
                        value={`${doctor.firstName} ${doctor.lastName}`}
                        key={index}
                      >
                        {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                </select>
              )}
            />
            {errors.doctorFirstName && <p>{errors.doctorFirstName.message}</p>}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address">Address</label>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <textarea {...field} rows="10" placeholder="Address" />
            )}
          />
          {errors.address && <p>{errors.address.message}</p>}
        </div>

        {/* Visit Checkbox */}
        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>Have you visited before?</p>
          <Controller
            name="hasVisited"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <input
                {...field}
                type="checkbox"
                style={{ flex: "none", width: "25px" }}
              />
            )}
          />
        </div>

        <button className="submitbtn" type="submit">
          GET APPOINTMENT
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
