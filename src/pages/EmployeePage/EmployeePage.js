// Router
import { useParams, useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase } from "../../hooks/useRemoveCases";

const EmployeePage = () => {
  const { id } = useParams();

	const [employee] = useFetch(`/employee/${id}`);

  const [name, setName] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Globals
	const globalUrl = "http://localhost:3001";
	// const globalUrl = "https://alemaoautolavagem.onrender.com";

  const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `${globalUrl}/employee/${id}`,
			data: { name },
			headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      if(res.status === 200 && !res.data.error){
        navigate("/employee");
      }
		})
    .catch((err) => {
			navigate("/employee", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

  useEffect(() => {
		if(employee){
			setName(removeKebabCase(employee.name));
		}
	}, [employee]);

  return (
    <div className="container">
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
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/employee")}>Cancelar edição</button>
      </div>
    </div>
  )
}

export default EmployeePage