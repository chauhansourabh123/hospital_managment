import Biography from "../components/Biography.jsx";
import Department from "../components/Department.jsx";
import Hero from "../components/Hero.jsx";
import MessageFrom from "../components/Messageform.jsx";

const Home = () => {
  return (
    <>
      <Hero title="Welcome to zeecare medical institute." imageUrl="/hero.png" />
      <Biography imageUrl="/about.png" />
      <Department />
      <MessageFrom />
    </>
  );
};

export default Home;
