import React from 'react'
import Decimal from 'decimal.js';

// CSS
import "./Service.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { convert } from "../../hooks/useConvertIsoDate";
import { toFixed } from "../../hooks/useToFixed";
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
	const services = useFetch("/service");



  const [serviceId, setServiceId] = useState('');

  const [customer, setCustomer] = useState('');
  const [expense, setExpense] = useState('');
  const [gain, setGain] = useState('');
  const [desc, setDesc] = useState('');
  const [payment, setPayment] = useState({
		payName: '',
		payValue: '',
		installment: '',
		total: ''
	});

	const [employeeExpense, setEmployeeExpense] = useState({
		id:'',
		gain: 0
	});

	// const handlePayment = (e) => {
	// 	const { value, name } = e.target;

	// 	setPayment(prevValue => {
  //     if(name === "name"){
	// 			calculateResult(value, prevValue.payValue);
  //       return {
	// 				payName: value, 
	// 				payValue: prevValue.payValue,
	// 				total: prevValue.total
	// 			}
  //     }
	// 		else if(name === "value"){
	// 			calculateResult(prevValue.payName, value);
  //       return {
	// 				payName: prevValue.payName,
	// 				payValue: value,
	// 				total: prevValue.total
	// 			}
  //     }
  //   });
	// }

	const handleFocus = () => {
		setGain('');
	}

  const handlePayment = (e) => {
		
    const { value, name } = e.target;

    setPayment((prevValue) => {
      if (name === 'payName' && value === 'Cartão de Crédito') {
        return {
          ...prevValue,
          payName: value
        };
      } else if (name === 'payName') {
        return {
          payName: value,
          payValue: '',
          installment: '',
          total: ''
        };
      } else if (name === 'payValue') {
        const installmentValue = (parseFloat(value) / parseInt(prevValue.installment)).toFixed(2);
        const result = `${prevValue.installment}X${installmentValue} = ${value}`;
        return {
          ...prevValue,
          payValue: value,
          total: result
        };
      } else if (name === 'installment') {
        const installmentValue = (parseFloat(prevValue.payValue) / parseInt(value)).toFixed(2);
        const result = `${value}X${installmentValue} = ${prevValue.payValue}`;
        return {
          ...prevValue,
          installment: value,
          total: result
        };
      }
    });
  };

	
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
			url: 'https://alemaoautolavagem.onrender.com/service',
			data: { customer, expense, gain, desc, payment },
			// validateStatus: () => true,
			// withCredentials: true
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

		axios.delete(`https://alemaoautolavagem.onrender.com/service/${id}`).then(res => {
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
			url: `https://alemaoautolavagem.onrender.com/employee/addservice/${employeeExpense.id}`,
			data: { gain: employeeExpense.gain },
			// validateStatus: () => true,
			// withCredentials: true
			})
			.then(res => {
			console.log(res);
			console.log(res.status);

			if(res.status === 200){
				setEmployeeExpense({id: '', gain: ''});
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
	console.log(payment);
	console.log(employeeExpense);

	if(payment.payName === "Cartão de Crédito") {
		document.querySelector("#gain")?.setAttribute('disabled', '');
	}
	else{
		document.querySelector("#gain")?.removeAttribute('disabled');
	}


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

								<td>
									{employees.map((employee) => (
										<React.Fragment key={employee._id}>
											{employee.services.some((es) => es.serviceId === service._id) ? `${removeKebabCase(employee.name)}; ` : ''}
										</React.Fragment>
									))}
								</td>

								<td>
									<div className="d-flex">
										<button type="button" className="update me-2" onClick={() => {handleUpdateService(service._id)}}>
											<img src="/icons/newPage.png" alt={service.name} width="20" height="20" />
										</button>

										<form onSubmit={handleDelete}>
											<input type="hidden" name="id" value={service._id} />
											<button type="submit" className="del"><img src="/icons/trash.png" alt="Del" width="20" height="20" /></button>
										</form>
									</div>
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
											<option value={customer._id} key={customer._id}>{ removeKebabCase(customer.name) }</option>
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
										<label className="col-form-label">Método de pagamento:</label>
										
										<select className="form-select" aria-label="Default select example" name="payName" onChange={handlePayment}  value={payment.payName}>
											<option value='' defaultValue>Selecione um método</option>
											<option value="Dinheiro">Dinheiro</option>
											<option value="Pix">Pix</option>
											<option value="Cartão de Débito">Cartão de Débito</option>
											<option value="Cartão de Crédito">Cartão de Crédito</option>
										</select>

										{/* {payment.payName === "Cartão de Crédito" ? (
											<div className="mt-3 input-group">
											<span className="input-group-text">Valor e parcelas</span>
											<input
														type="number"
														step={0.01}
														className="form-control"
														placeholder="Valor"
														name="payValue"
														value={payment?.payValue}
														onChange={handlePayment}
													/>
													<input
														type="number"
														className="form-control"
														placeholder="Parcelas"
														name="installment"
														value={payment?.installment}
														onChange={handlePayment}
													/>
											</div>
										) : ''} */}

										{payment.payName === 'Cartão de Crédito' && (
											
											<div className="mt-3 input-group">
												<input
													type="number"
													step={0.01}
													className="form-control"
													placeholder="Valor"
													name="payValue"
													value={payment.payValue}
													onChange={handlePayment}
													onFocus={handleFocus}
												/>
												<input
													type="number"
													className="form-control"
													placeholder="Parcelas"
													name="installment"
													value={payment.installment}
													onChange={handlePayment}
													onFocus={handleFocus}
												/>
											</div>
										)}
										

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
							<h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Linkar funcionário a esse serviço</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							

              <form onSubmit={handleAddEmployee}>
								<div className="mb-3">
									<label className="col-form-label">Funcionário:</label> {/* Select */}
									
									<select name="id" className="form-select" aria-label="Default select example" onChange={handleChange} >
									<option value='' defaultValue>Selecione um funcionário</option>
									{employees.map((employee) => (
										<option name="id" value={employee._id} key={employee._id}>{ removeKebabCase(employee.name) }</option>
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