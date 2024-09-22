import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const MessageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      toast.success(response.data.message);

      // Clear form fields after successful submission
      reset();
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else if (error.request) {
        toast.error("No response received from server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="container form-component message-form">
      <h2>Send Us A Message</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text" // Using text to handle various input formats
              placeholder="Mobile Number"
              {...register("phone", { required: "Mobile Number is required" })}
            />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>
        </div>
        <textarea
        style={{ width: "60%", resize: "none"}}
          rows={7}
          placeholder="Message"
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && <p>{errors.message.message}</p>}

        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button className="submitMessageBtn" type="submit">
            Send
          </button>
        </div>
      </form>
      <img src="/Vector.png" alt="vector" />
    </div>
  );
};

export default MessageForm;
