// Axios
import axios from "axios";

// Hooks
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert"
import Loader from "../../components/Loader/Loader";

const EmployeePage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  

  // Globals
  // const URL = "https://white-grasshopper-gear.cyclic.cloud";
	// const URL = "https://alemaoautolavagem.onrender.com";
	const URL = "http://localhost:3001";

  const handleSubmit = (e) => {
		e.preventDefault();
    setLoading(true);

		axios({
			method: 'PUT',
			url: `${URL}/profile`,
			data: { password },
			headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      setLoading(false);

      if(res.status === 200 && !res.data.error){
        navigate("/", { state: { title: res.data.msg, message: '' } });
      }
		})
    .catch((err) => {
      setLoading(false);
      
			navigate("/profile", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
	}

  return (
    <div className="container">
      {location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}

      <h1>Atualize seus dados</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Senha</label>
          <input 
            type="password" 
            className="form-control mb-3" 
            name="password"
            placeholder="Insira sua nova senha" 
            autoComplete='off'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>

        {!loading ? (
          <button type="submit" className="btn btn-primary">Atualizar</button>
        ) : (
          <Loader />
        )}
      </form>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancelar edição</button>
      </div>
    </div>
  )
}

export default EmployeePage