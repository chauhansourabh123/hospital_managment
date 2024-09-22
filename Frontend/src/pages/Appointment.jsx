import AppointmentForm from "../components/AppointmentFrom.jsx";
import Hero from "../components/Hero";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../context/Context.jsx"
import { useContext } from "react";


const Appointment = () => {

  const { isAuthenticated } = useContext(Context);

if(!isAuthenticated){
  return <Navigate to={"/login"}/>
}  
  return (
    <>
      <Hero
        title="Schedule Your Appointment | ZeeCare Medical Institute"
        imageUrl={"./signin.png"}
      />
      <AppointmentForm/>
    </>
  );
};

export default Appointment;
