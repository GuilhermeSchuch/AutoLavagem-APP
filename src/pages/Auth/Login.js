// CSS
import "./Login.css";

// Router
import { useNavigate } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert";

// Axios
import axios from "axios";

// Hooks
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [display, setDisplay] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsButtonDisabled(true);


        const response = await axios({
            method: 'POST',
            url: 'https://alemaoautolavagem.onrender.com/login',
            data: { email, password }
        }).then(res => {
            if(res.status === 200 && !res.data.error){
              const { token } = res.data;
              const setDate = Date.now();

              localStorage.setItem('token', token);
              localStorage.setItem('setDate', setDate);

              navigate("/", { state: { title: "Login efetuado com sucesso!", message: res.data.msg } });
            }
            else{

            }
        });
        setIsButtonDisabled(false);
    }

  return (
    <>

      <div className={display === false ? 'd-none' : 'd-block'}>
        { <Alert text={"E-mail e/ou estão incorretos!"} /> }
      </div>
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

              <button className="btn btn-primary w-100 py-2" disabled={isButtonDisabled}>{ !isButtonDisabled ? 'Entrar' : 'Carregando...' }</button>


          </form>
      </main>


    </>


  )
}

export default Login