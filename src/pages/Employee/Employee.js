import React from 'react';

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase } from "../../hooks/useRemoveCases";
import { useNavigate, useLocation } from 'react-router-dom';

// Axios
import axios from "axios";

// Components
import Loader from '../../components/Loader/Loader';
import Alert from "../../components/Alert/Alert";

const Employee = () => {
  const navigate = useNavigate();
	const location = useLocation();

  const employees = useFetch("/employee");

	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem('token');

	// Globals
	const URL = "https://white-grasshopper-gear.cyclic.cloud";
	// const URL = "https://alemaoautolavagem.onrender.com";
	// const URL = "http://localhost:3001";

  const handleDelete = (e) => {
		e.preventDefault();

		const id = e.target[0].value

		axios.delete(`${URL}/employee/${id}`, {
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 204 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/employee", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
	}

  const handleSubmitEmployee = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: `${URL}/employee`,
			data: { name },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 201 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/employee", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
	}

  const handleUpdateEmployee = (id) => {
		navigate(`/employee/${id}`);
	}

	useEffect(() => {
		if(employees.length === 0){
			setLoading(true);
		}
		else{
			setLoading(false);
		}
  }, [employees]);

  return (
    <div className="container">
			{location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}

			{!loading ? (
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">Nome</th>
							<th scope="col">Ações</th>
						</tr>
					</thead>

					<tbody>
						{employees.map((employee) => (
							<React.Fragment key={employee._id}>
								<tr>
									<td>{ removeKebabCase(employee.name) }</td>

									<td>
										<div className="d-flex">
											<button type="button" className="update me-2" onClick={() => {handleUpdateEmployee(employee._id)}}>
												<img src="/icons/newPage.png" alt={employee.name} width="20" height="20" />
											</button>

											<form onSubmit={handleDelete}>
												<input type="hidden" name="id" value={employee._id} />
												<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
											</form>
										</div>
									</td>
								</tr>
							</React.Fragment>
						))}

					</tbody>
				</table>
			) : (
				<Loader />
			)}

			{/* Create Employee */}
			<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal" data-bs-whatever="createModal">Adicionar Funcionário</button>
			<div className="modal fade createModal" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="createModalLabel">Adicionar Funcionário</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmitEmployee}>
								<div className="mb-3">
									<label className="col-form-label">Funcionário:</label>
									<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
								</div>

								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
									<button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Adicionar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
	</div>
  )
}

export default Employee