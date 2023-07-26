// CSS
import "./Home.css";

// Hooks
import useFetch from "../../hooks/useFetch";

const Home = () => {
  const data = useFetch("/car");
  console.log(data);
  return (
    <div>Home</div>
  )
}

export default Home