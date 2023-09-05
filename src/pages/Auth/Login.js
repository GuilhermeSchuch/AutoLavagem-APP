// CSS
import "./Login.css";

// Router
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert";
import Loader from "../../components/Loader/Loader";

// Axios
import axios from "axios";

// Hooks
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Globals
  const URL = "https://white-grasshopper-gear.cyclic.cloud";
  // const URL = "https://alemaoautolavagem.onrender.com";
  // const URL = "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);
    setShowAlert(false);

    const response = await axios({
      method: 'POST',
      url: `${URL}/login`,
      data: { email, password }
    })
    .then(res => {
      if(res.status === 200 && !res.data.error){
        const { token } = res.data;
        const setDate = Date.now();

        localStorage.setItem('token', token);
        localStorage.setItem('setDate', setDate);

        navigate("/", { state: { title: "Login efetuado com sucesso!", message: res.data.msg } });
      }
    })
    .catch((err) => {
      setShowAlert(true);
      
      navigate("/login", { state: { title: "Login não efetuado!", message: err.response.data.error, type: "danger" } });
    });
    setIsButtonDisabled(false);
  }

  return (
    <>
      {showAlert && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}
      
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Por favor, faça o login</h1>

          <div className="form-floating">
            <input type="email" className="form-control mb-2 rounded-2" id="floatingInput" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>

          <div className="form-floating">
            <input type="password" className="form-control rounded-2" id="floatingPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Senha</label>
          </div>

          {!isButtonDisabled ? <button className="btn btn-primary w-100 py-2" disabled={isButtonDisabled}>{ !isButtonDisabled ? 'Entrar' : 'Carregando...' }</button> : <Loader />}
        </form>
      </main>
    </>
  )
}

export default Login