// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase } from "../../hooks/useRemoveCases";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert";

const EmployeePage = () => {
  const { id } = useParams();

	const [employee] = useFetch(`/employee/${id}`);

  const [name, setName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Globals
	const URL = "http://localhost:3001";

  const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `${URL}/employee/${id}`,
			data: { name },
			headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      if(res.status === 200 && !res.data.error){
        navigate("/employee");
      }
		})
    .catch((err) => {
			navigate("/employee", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
	}

  useEffect(() => {
		if(employee){
			setName(removeKebabCase(employee.name));
		}
	}, [employee]);

  return (
    <div className="container">
      {location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}

      <h1>Modificar funcionário</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input 
              type="text" 
              className="form-control mb-3" 
              name="name"
              placeholder="Insira o nome" 
              autoComplete='off'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
          />
        </div>

        <button type="submit" className="btn btn-primary">Atualizar</button>
      </form>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/employee")}>Voltar</button>
      </div>
    </div>
  )
}

export default EmployeePage