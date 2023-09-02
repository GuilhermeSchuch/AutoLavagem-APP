// Hooks
import { useLocation } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert";

const Home = () => {
  const location = useLocation();

  return (
    <div>
      {location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}
    </div>
  )
}

export default Home