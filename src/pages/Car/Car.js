import React from 'react';

// CSS
import "./Car.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import Alert from '../../components/Alert/Alert';

// Axios
import axios from "axios";

const Car = () => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const cars = useFetch("/car");

	const [name, setCarName] = useState('');
	const [plate, setPlate] = useState('');

	const token = localStorage.getItem('token');

	// Globals
	// const globalUrl = "https://alemaoautolavagem.onrender.com";
	const globalUrl = "http://localhost:3001";

	const handleDelete = (e) => {
		e.preventDefault();

		const plate = e.target[0].value
		
		axios.delete(`${globalUrl}/car/${plate}`, {
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 204 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/car", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	const handleSubmitCar = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: `${globalUrl}/car`,
			data: { name, plate },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 201 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/car", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	const handleUpdateCar = (paramPlate) => {
		navigate(`/car/${paramPlate}`);
	}

  return (
    <div className="container">
			{location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Carro</th>
						<th scope="col">Placa</th>
						<th scope="col">Ações</th>
					</tr>
				</thead>

				<tbody>
					{cars.map((car) => (
						<React.Fragment key={car._id}>
							<tr>
								<td>{ removeKebabCase(car.name) }</td>
								<td>{ removeSpaceCase(removeKebabCase((car.plate))).toUpperCase() }</td>
								<td>
									<div className="d-flex">
										<button type="button" className="update me-2" onClick={() => {handleUpdateCar(car.plate)}}>
											<img src="/icons/newPage.png" alt={car.plate} width="20" height="20" />
										</button>

										<form onSubmit={handleDelete}>
											<input type="hidden" name="id" value={car.plate} />
											<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
										</form>
									</div>
								</td>
							</tr>		
						</React.Fragment>
					))}

				</tbody>
			</table>

			{/* Create Car */}
			<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal" data-bs-whatever="createModal">Adicionar Carro</button>

			<div className="modal fade createModal" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="createModalLabel">Adicionar Carro</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmitCar}>
								<div className="mb-3">
									<label className="col-form-label">Carro:</label>
									<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={name} onChange={(e) => setCarName(e.target.value)} />
								</div>
								<div className="mb-3">
									<label className="col-form-label">Placa:</label>
									<input type="text" className="form-control" autoComplete='off' id="plate" name="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
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

export default Car