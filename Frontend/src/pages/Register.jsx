import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../context/Context.jsx";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { ...data, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ marginTop: "100px" }}>Sign Up</h2>
        <p style={{ color: "black", marginBottom: "20px" }}>
          Please Sign Up To Continue
        </p>
        <p style={{ color: "black", marginBottom: "20px" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat culpa
          voluptas expedita itaque ex, totam ad quod error?
        </p>
      </div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="registerForm">
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <input
              type="text"
              placeholder="Mobile Number"
              {...register("phone", { required: "phone number is required" })}
            />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Aadhar Number"
              {...register("aadhar", { required: "aadhar is required" })}
            />
            {errors.aadhar && <p>{errors.aadhar.message}</p>}
            <input
              type="date"
              placeholder="Date of Birth"
              {...register("dob", { required: "Date of birth is required" })}
            />
            {errors.dob && <p>{errors.dob.message}</p>}
          </div>
          <div className="gender">
            <select {...register("gender", { required: "Gender is required" })}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p>{errors.gender.message}</p>}
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <p>Already Registered?</p>
          <Link
            to={"/login"}
            style={{ textDecoration: "none", color: "#271776ca" }}
          >
            Login Now
          </Link>
        </div>
        <div className="registerBtn">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
