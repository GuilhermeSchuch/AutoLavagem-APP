// CSS
import "./EmployeePage.css";

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
	// console.log(employee);

  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `https://alemaoautolavagem.onrender.com/employee/${id}`,
			data: { name },
			// validateStatus: () => true,
			// withCredentials: true
			})
			.then(res => {
			// console.log(res);
			// console.log(res.status);

			if(res.status === 200){
				navigate("/employee");
			}
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