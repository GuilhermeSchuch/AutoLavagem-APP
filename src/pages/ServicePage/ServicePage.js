// CSS
import "./ServicePage.css";

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { convert } from "../../hooks/useConvertIsoDate";
import { toFixed } from "../../hooks/useToFixed";
import { useState, useEffect } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";

const ServicePage = () => {
	const { plate } = useParams();
	const [car] = useFetch(`/car/${plate}`);
	// console.log(car);
	

  const services = useFetch(`/service`);
  const employees = useFetch(`/employee`);

  const { id } = useParams();
  const [service] = useFetch(`/service/${id}`);
  const customers = useFetch(`/customer`);
  // console.log(service);
	

	const [carName, setCarName] = useState('');
	const [carPlate, setCarPlate] = useState('');

  const [desc, setDesc] = useState('');
  const [customer, setCustomer] = useState('');

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `http://localhost:3001/service/${id}`,
			data: { desc },
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
		if(service){
			setDesc(service.desc);
		}
	}, [service]);

  const handleSubmitService = () => {}

  
  

  return (
    <div className="container">
			<h1>Modificar serviço</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group my-3">
					<label>Obs</label>
					<input 
						type="text" 
						className="form-control" 
						name="desc"
						placeholder="Insira a obs" 
						autoComplete='off'
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						autoFocus
					/>
				</div>


				<button type="submit" className="btn btn-primary">Atualizar</button>
			</form>

			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={() => navigate("/service")}>Cancelar edição</button>
			</div>

      <div className="container my-5">
        <header className="pb-3 mb-4 border-bottom">
          <div href="#" className="d-flex align-items-center text-body-emphasis text-decoration-none">

            <span className="fs-4">Dados ({ convert(service?.createdAt) })</span>
          </div>
        </header>

        <div className="row align-items-md-stretch">
          <div className="col-md-6 mb-3">
            <div className="h-100 p-5 bg-body-tertiary border rounded-3">
							<h2>Cliente</h2>
							<div className="card p-3 my-2">
								<ul>
									<li>Nome: { service && removeKebabCase(service?.customer?.name) }</li>
									<li>Tel: { service && removeKebabCase(service?.customer?.tel) }</li>
									<li>CPF: { service && removeKebabCase(service?.customer?.cpf) }</li>
								</ul>
							</div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="h-100 p-5 bg-body-tertiary border rounded-3">
              <h2>Funcionário(s)</h2>
              {/* {employees.map((employee) => (
								<div key={employee?._id} className="shadow">
									<ul>
										<li>{employee.services.some((es) => es.serviceId === id) ? "Nome: " + removeKebabCase(employee.name) : ''}</li>
										
										
										<li>{employee.services.some((es) => es.serviceId === id) ? 
											`Ganho: R$${parseFloat(employee.services.find((es) => es.serviceId === id)?.gain).toFixed(2)}` : ''
										}</li>
									</ul>


								</div>
							))} */}
							{employees.map((employee) => {
								if (employee.services.some((es) => es.serviceId === id)) {
									return (
										<div key={employee?._id} className="card p-3 my-2">
											<ul className="d-flex flex-column justify-content-center">
												<li>Nome: {removeKebabCase(employee.name)}</li>
												<li>Ganho: R$ {toFixed(parseFloat(employee.services.find((es) => es.serviceId === id)?.gain))}</li>
											</ul>
										</div>
									);
								}
								return null;
							})}


              
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="h-100 p-5 bg-body-tertiary border rounded-3">
              <h2>Financeiro</h2>
							<div className="card p-3 my-2">
								<ul>
									<li>Dispesa (geral): R${ service && (toFixed(service.expense)) }</li>
									
									{/* {employees.map((employee) => (
										<div key={employee?._id}>
											<p>Nome: {removeKebabCase(employee.name)}</p>
											
											
											{console.log('Employee Gain:', 
												parseFloat(employee.services.find((es) => es.serviceId === id)?.gain)
											)}
											
											
											<p>Ganho: {employee.services.some((es) => es.serviceId === id) ? 
												`$${parseFloat(employee.services.find((es) => es.serviceId === id)?.gain).toFixed(2)}` : 'N/A'
											}</p>
										</div>
									))} */}
									
									{/* Calculate and display the total gain from all employees */}
									<li>Total gasto com funcionários: R${
										toFixed(employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, 0))
									}</li>

									<li>Dispesa Total: R${
										toFixed(employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense)))
									}</li>
								</ul>
							</div>

							<div className="card p-3 my-2">
								<ul>
									<li>Lucro bruto: { service?.gain ? toFixed(parseFloat(service?.gain)) : service?.payment.total }</li>
									<li>Lucro líquido: R$
										{
										service?.gain ? toFixed(service?.gain - employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense))) : toFixed(service?.payment.payValue - employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense)))
									}</li>
								</ul>
							</div>
              
            </div>
          </div>
        </div>
      </div>
	</div>
  )
}

export default ServicePage