// CSS
import "./Login.css";

// Router
import { useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // await axios.post('https://alemaoautolavagem.onrender.com/login', 
        //     {
        //         username: username,
        //         password: password,
        //     }, 
        //     {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // )

        axios({
            method: 'POST',
            url: 'http://localhost:3001/login',
            data: { username, password },
            validateStatus: () => true,
            withCredentials: true
        }).then(res => {
            console.log(res);
            console.log(res.status);
            if(res.status === 200){
                navigate("/")
            }
        });
    }

  return (
    <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Por favor, faça o login</h1>

            <div className="form-floating">
                <input type="email" className="form-control mb-2 rounded-2" id="floatingInput" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Email</label>
            </div>

            <div className="form-floating">
                <input type="password" className="form-control rounded-2" id="floatingPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label>Senha</label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">Entrar</button>
        </form>
    </main>
  )
}

export default Login