import React from 'react';

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";
import { useNavigate, useLocation } from 'react-router-dom';

// Axios
import axios from "axios";

// Components
import Loader from '../../components/Loader/Loader';
import Alert from "../../components/Alert/Alert";

const Customer = () => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const customers = useFetch("/customer");
	const cars = useFetch("/car");

	const [name, setName] = useState('');
	const [tel, setTel] = useState('');
	const [cpf, setCpf] = useState('');
	const [car, setCar] = useState([]);
	const [carName, setCarName] = useState('');
	const [plate, setPlate] = useState('');
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem('token');

	// Globals
	const URL = "https://white-grasshopper-gear.cyclic.cloud";
	// const URL = "https://alemaoautolavagem.onrender.com";
	// const URL = "http://localhost:3001";


	const handleSubmitCustomer = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: `${URL}/customer`,
			data: { name, tel, cpf },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
		})
		.catch((err) => {
			navigate("/customer", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	const handleDelete = (e) => {
		e.preventDefault();

		const id = e.target[0].value

		axios.delete(`${URL}/customer/${id}`, {
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 204 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/customer", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	const handleUpdateCustomer = (id) => {
		navigate(`/customer/${id}`);
	}

	const handleAddCar = (e) => {
		e.preventDefault();
		
		axios({
			method: 'PUT',
			url: `${URL}/customer/addcar/${plate}`,
			data: { name: carName, plate },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 200 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/customer", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	useEffect(() => {
		if(customers.length === 0){
			setLoading(true);
		}
		else{
			setLoading(false);
		}
  }, [customers]);

  return (
    <div className="container">
			{location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}
			
			{!loading ? (
				<table className="table table-hover">
					<thead>
						<tr>
							<th scope="col">Nome</th>
							<th scope="col">Telefone</th>
							<th scope="col">CPF</th>
							<th scope="col">Carro(s)</th>
							<th scope="col">Ações</th>
						</tr>
					</thead>

					<tbody>
						{customers.map((customer, index) => (
							<React.Fragment key={customer._id}>
								<tr>
									<td>{ removeKebabCase(customer.name) }</td>
									<td>{ removeSpaceCase(removeKebabCase((customer.tel))) }</td>
									<td>{ removeSpaceCase(removeKebabCase((customer.cpf))) }</td>
									
									<td>
										{cars.map((car) => (
											<React.Fragment key={car.plate}>
												{customer.car.some((cr) => cr.plate === car.plate) ? `${removeKebabCase(car.plate).toUpperCase()}; ` : ''}
											</React.Fragment>
										))}
									</td>
									
									<td>
										<div className="d-flex">
											<button type="button" className="update me-2" onClick={() => {handleUpdateCustomer(customer._id)}}>
												<img src="/icons/newPage.png" alt={customer.name} width="20" height="20" />
											</button>

											<form onSubmit={handleDelete}>
												<input type="hidden" name="id" value={customer._id} />
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

			<div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalToggleLabel">Adicionar Cliente</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmitCustomer}>
									<div className="mb-3">
										<label className="col-form-label">Nome:</label>
										<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required/>
									</div>
									<div className="mb-3">
										<label className="col-form-label">Telefone:</label>
										<input type="text" className="form-control" autoComplete='off' id="plate" name="plate" value={tel} onChange={(e) => setTel(e.target.value)} />
									</div>
									<div className="mb-3">
										<label className="col-form-label">CPF:</label>
										<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={cpf} onChange={(e) => setCpf(e.target.value)} />
									</div>


									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
										<button type="submit" className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Adicionar Cliente</button>
									</div>
							</form>
						</div>
						
					</div>
				</div>
			</div>
			<div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Linkar carro a esse cliente</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleAddCar}>
								{cars.map((car, index) => (
									<div key={car.plate} className="form-check" onClick={() => setPlate(car.plate)}>
										<input className="form-check-input" type="radio" name="car" id="flexRadioDefault1" />
										<label className="form-check-label">
											{ removeSpaceCase(removeKebabCase((car.plate))).toUpperCase() }
										</label>
									</div>
								))}

								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => window.location.reload(true)}>Não linkar agora</button>
									<button type="submit" className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Linkar Carro</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Adicionar Cliente</button>
	</div>
  )
}

export default Customer