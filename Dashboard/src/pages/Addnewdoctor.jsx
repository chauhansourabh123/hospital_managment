import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../context/Context.jsx";
import axios from "axios";
import { useForm } from "react-hook-form";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", 
    "Neurology", "Oncology", "Radiology", 
    "Physical Therapy", "Dermatology", "ENT"
  ];

  const { register, handleSubmit, reset } = useForm();

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("avatar", docAvatar);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/addDoctor",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      toast.success(response.data.message);
      reset(); // Clear the form
      setDocAvatar(""); // Reset avatar
      setDocAvatarPreview("");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding doctor");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">REGISTER A NEW DOCTOR</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="first-wrapper">
            <div className="image">
              <img
                src={docAvatarPreview || "/docHolder.jpg"}
                alt="Doctor Avatar"
              />
              <input type="file" accept="image/*" onChange={handleAvatar} required />
            </div>
            <div>
              {["firstName", "lastName", "email", "phone", "aadhar", "dob"].map((field, index) => (
                <input
                  key={index}
                  type={field === "dob" ? "date" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  {...register(field, { required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` })}
                />
              ))}
              <select {...register("gender", { required: "Gender is required" })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select {...register("doctorDepartment", { required: "Department is required" })}>
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>{depart}</option>
                ))}
              </select>
              <button type="submit">Register New Doctor</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
