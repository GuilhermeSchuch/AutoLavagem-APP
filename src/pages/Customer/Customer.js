import React from 'react';

// CSS
import "./Customer.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";

// Router
import { useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

const Customer = () => {
	const navigate = useNavigate();
	
	const customers = useFetch("/customer");
	const cars = useFetch("/car");
	// console.log(customers);

	const [name, setName] = useState('');
	const [tel, setTel] = useState('');
	const [cpf, setCpf] = useState('');
	const [car, setCar] = useState([]);

	const [carName, setCarName] = useState('');
	const [plate, setPlate] = useState('');

	const handleSubmitCustomer = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: 'http://localhost:3001/customer',
			data: { name, tel, cpf },
			validateStatus: () => true,
			withCredentials: true
			})
			.then(res => {
			console.log(res);
			console.log(res.status);

			if(res.status === 201){
				// window.location.reload(true)
			}
		});
	}

	const handleDelete = (e) => {
		e.preventDefault();

		const id = e.target[0].value

		axios.delete(`http://localhost:3001/customer/${id}`).then(res => {
			console.log(res);
			console.log(res.status);
			if(res.status === 204){
				window.location.reload(true);
			}
		});
	}

	const handleUpdateCustomer = (id) => {
		navigate(`/customer/${id}`);
	}

	const handleAddCar = (e) => {
		e.preventDefault();
		console.log(plate);
		axios({
			method: 'PUT',
			url: `http://localhost:3001/customer/addcar/${plate}`,
			data: { name: carName, plate },
			validateStatus: () => true,
			withCredentials: true
			})
			.then(res => {
			console.log(res);
			console.log(res.status);

			if(res.status === 200){
				window.location.reload(true)
			}
		});
	}

  return (
    <div className="container">
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
							
							<td className="d-flex">
								<button type="button" className="update me-2" onClick={() => {handleUpdateCustomer(customer._id)}}>
									<img src="/icons/newPage.png" alt={customer.name} width="20" height="20" />
								</button>

								<form onSubmit={handleDelete}>
									<input type="hidden" name="id" value={customer._id} />
									<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
								</form>
							</td>
						</tr>
						
						</React.Fragment>
					))}

				</tbody>
			</table>

			{/* Create Customer */}
			{/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal" data-bs-whatever="createModal">Adicionar Cliente</button>
			<div className="modal fade createModal" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="createModalLabel">Adicionar Cliente</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmitCustomer}>
								<div className="mb-3">
									<label className="col-form-label">Nome:</label>
									<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
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
									<button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Adicionar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div> */}



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
										<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
									</div>
									<div className="mb-3">
										<label className="col-form-label">Telefone:</label>
										<input type="text" className="form-control" autoComplete='off' id="plate" name="plate" value={tel} onChange={(e) => setTel(e.target.value)} />
									</div>
									<div className="mb-3">
										<label className="col-form-label">CPF:</label>
										<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={cpf} onChange={(e) => setCpf(e.target.value)} />
									</div>

									{/* <div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
										<button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Adicionar</button>
									</div> */}

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
						{/* <div class="modal-footer">
							<button class="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Back to first</button>
						</div> */}
					</div>
				</div>
			</div>
			<button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Adicionar Cliente</button>





	</div>
  )
}

export default Customer