import React from 'react';

// CSS
import "./Employee.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { removeKebabCase } from "../../hooks/useRemoveCases";

// Axios
import axios from "axios";

// Router
import { useNavigate } from 'react-router-dom';

const Employee = () => {
  const navigate = useNavigate();

  const employees = useFetch("/employee");
	console.log(employees);

	const [name, setName] = useState('');

  const handleDelete = (e) => {
		e.preventDefault();

		const id = e.target[0].value
		console.log(id);

		axios.delete(`http://localhost:3001/employee/${id}`).then(res => {
			console.log(res);
			console.log(res.status);
			if(res.status === 204){
				window.location.reload(true);
			}
		});
	}

  const handleSubmitEmployee = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: 'http://localhost:3001/employee',
			data: { name },
			validateStatus: () => true,
			withCredentials: true
			})
			.then(res => {
			console.log(res);
			console.log(res.status);

			if(res.status === 201){
				window.location.reload(true)
			}
		});
	}

  const handleUpdateEmployee = (id) => {
		navigate(`/employee/${id}`);
	}

  return (
    <div className="container">
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Nome</th>
						<th scope="col">Ações</th>
					</tr>
				</thead>

				<tbody>
					{employees.map((employee, index) => (
						<React.Fragment key={employee._id}>
						<tr>
							<td>{ removeKebabCase(employee.name) }</td>
							<td className="d-flex">
								<button type="button" className="update me-2" onClick={() => {handleUpdateEmployee(employee._id)}}>
									<img src="/icons/newPage.png" alt={employee.name} width="20" height="20" />
								</button>

								<form onSubmit={handleDelete}>
									<input type="hidden" name="id" value={employee._id} />
									<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
								</form>
							</td>
						</tr>
						
						</React.Fragment>
					))}

				</tbody>
			</table>

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