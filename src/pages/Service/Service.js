import React from 'react'

// CSS
import "./Service.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { convert } from "../../hooks/useConvertIsoDate";
import { useState, useEffect } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";

// Router
import { useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

const Service = () => {
	const navigate = useNavigate();
	
	const customers = useFetch("/customer");
	const employees = useFetch("/employee");
	const cars = useFetch("/car");


	const services = useFetch("/service");
  // const serviceId = services.pop();
	// console.log(serviceId._id);

	const [carName, setCarName] = useState('');
	const [plate, setPlate] = useState('');


  const [serviceId, setServiceId] = useState('');

  const [customer, setCustomer] = useState('');
  const [employeesId, setEmployeesId] = useState([]);
  const [expense, setExpense] = useState('');
  const [gain, setGain] = useState('');
  const [desc, setDesc] = useState('');

	const [employeeExpense, setEmployeeExpense] = useState({
		id:'',
		gain: 0
	});

	
  const handleChange = (e) => {
    const { value, name } = e.target;

    setEmployeeExpense(prevValue => {
      if(name === "id"){
        return {
					id: value, 
					gain: prevValue.gain,
				}
      }
			else if(name === "gain"){
        return {
					id: prevValue.id,
					gain: value,
				}
      }
    });

  }

	const handleSubmitService = (e) => {
		e.preventDefault();

		axios({
			method: 'POST',
			url: 'http://localhost:3001/service',
			data: { customer, expense, gain, desc },
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

		axios.delete(`http://localhost:3001/service/${id}`).then(res => {
			console.log(res);
			console.log(res.status);
			if(res.status === 204){
				window.location.reload(true);
			}
		});
	}

	const handleUpdateService = (id) => {
		navigate(`/service/${id}`);
	}

	const handleAddEmployee = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `http://localhost:3001/employee/addservice/${employeeExpense.id}`,
			data: { gain: employeeExpense.gain },
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

  const handleAddEmployees = (e) => {
		e.preventDefault();
		axios({
			method: 'PUT',
			url: `http://localhost:3001/service/addemployees/${serviceId._id}`,
			data: { employee: employeesId },
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

  useEffect(() => {
		if(services){
      const service = services[services.length - 1];
			setServiceId(service)
		}

	}, [services]);

  // console.log(employeeExpense);

  return (
    <div className="container">
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Data</th>
						<th scope="col">Serviço</th>
						<th scope="col">Cliente</th>
						<th scope="col">Funcionário(s)</th>
						{/* <th scope="col">Lucro</th> */}
						<th scope="col">Ações</th>
					</tr>
				</thead>

				<tbody>
					{services.map((service) => (
						<React.Fragment key={service._id}>
							<tr>
								<td>{ convert(service.createdAt) }</td>
								<td>{ service.desc }</td>
								<td>{ removeKebabCase(service.customer.name) }</td>

								{employees.map((employee) => (
									<td key={employee._id}>
										{employee.services.some((es) => es.serviceId === service._id) ? removeKebabCase(employee.name) : ''}
									</td>
								))}

						
								{/* service.gain - (employee.services.gain + service.expense) */}
		

								<td className="d-flex">
									<button type="button" className="update me-2" onClick={() => {handleUpdateService(service._id)}}>
										<img src="/icons/newPage.png" alt={service.name} width="20" height="20" />
									</button>

									<form onSubmit={handleDelete}>
										<input type="hidden" name="id" value={service._id} />
										<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
									</form>
								</td>
							</tr>
						
						</React.Fragment>
					))}

				</tbody>
			</table>

			<div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalToggleLabel">Adicionar Serviço</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form onSubmit={handleSubmitService}>
									<div className="mb-3">
										<label className="col-form-label">Cliente:</label> {/* Select */}
										
										<select className="form-select" aria-label="Default select example" onChange={(e) => setCustomer(e.target.value)}>
										<option value='' defaultValue>Selecione um cliente</option>
										{customers.map((customer) => (
											<option value={customer._id} >{ removeKebabCase(customer.name) }</option>
										))}  
										</select>
									</div>

									<div className="mb-3">
										<label className="col-form-label">Ganho:</label>
										<input type="number" step={0.01} className="form-control" autoComplete='off' id="gain" name="gain" value={gain} onChange={(e) => setGain(e.target.value)} />
									</div>

									<div className="mb-3">
										<label className="col-form-label">Dispesa (geral):</label>
										<input type="number" step={0.01} className="form-control" autoComplete='off' id="name" name="name" value={expense} onChange={(e) => setExpense(e.target.value)} />
									</div>

									<div className="mb-3">
										<label className="col-form-label">Obs:</label>
										<input type="text" className="form-control" autoComplete='off' id="name" name="name" value={desc} onChange={(e) => setDesc(e.target.value)} />
									</div>

									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
										<button type="submit" className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Adicionar Serviço</button>
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
							<h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Linkar funcionário à esse serviço</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							

              <form onSubmit={handleAddEmployee}>
								<div className="mb-3">
									<label className="col-form-label">Funcionário:</label> {/* Select */}
									
									<select name="id" className="form-select" aria-label="Default select example" onChange={handleChange}>
									<option value='' defaultValue>Selecione um funcionário</option>
									{employees.map((employee) => (
										<option name="id" value={employee._id}>{ removeKebabCase(employee.name) }</option>
									))}  
									</select>
								</div>

								<div className="mb-3">
										<label className="col-form-label">Valor recebido:</label>
										<input type="number" step={0.01} className="form-control" autoComplete='off' id="gain" name="gain" value={employeeExpense.gain} onChange={handleChange} />
								</div>

              
								<div className="btn-group mt-2 d-flex">
									<button type="submit" className="btn btn-primary">Linkar</button>
									<button type="button" className="btn btn-secondary" onClick={() => window.location.reload(true)}>Fechar</button>
								</div>
							</form>
							
						</div>
						
					</div>
				</div>
			</div>
			<button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Adicionar Serviço</button>

      
    </div>
  )
}

export default Service