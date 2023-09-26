// CSS
import "./ServicePage.css";

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { convert } from "../../hooks/useConvertIsoDate";
import { toFixed } from "../../hooks/useToFixed";
import { useState, useEffect } from "react";
import { removeKebabCase } from "../../hooks/useRemoveCases";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Components
import Alert from "../../components/Alert/Alert";

const ServicePage = () => {
	const { id } = useParams();

	const navigate = useNavigate();
	const location = useLocation();

	const token = localStorage.getItem('token');

  const employees = useFetch(`/employee`);
  const [service] = useFetch(`/service/${id}`);
  
  const [desc, setDesc] = useState('');

	// Globals
	const URL = "https://white-grasshopper-gear.cyclic.cloud";
	// const URL = "https://alemaoautolavagem.onrender.com";
	// const URL = "http://localhost:3001";
	
	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `${URL}/service/${id}`,
			data: { desc },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 200 && !res.data.error){
				window.location.reload(true);
			}
		})
		.catch((err) => {
			navigate("/service", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
	}

	useEffect(() => {
		if(service){
			setDesc(service.desc);
		}
	}, [service]);

  return (
    <div className="container">
			{location?.state?.title && <Alert title={location?.state?.title} message={location?.state?.message} type={location?.state?.type ? location?.state?.type : "success"} />}

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
				<button type="button" className="btn btn-secondary" onClick={() => navigate("/service")}>Voltar</button>
			</div>

      <div className="container my-5">
        <header className="pb-3 mb-4 border-bottom">
          <div href="#" className="d-flex align-items-center text-body-emphasis text-decoration-none">

            <span className="fs-4">Dados ({ convert(service?.createdAt) })</span>
          </div>
        </header>

        <div className="row align-items-md-stretch">
					
				<div className="col-md-6 mb-4">
					<div className="custom-card card h-100 border rounded-3 shadow">
						<div className="card-body">
							<h2 className="card-title">Cliente</h2>
							<div className="customer-details card mb-2">
								<ul className="list-group list-group-flush">
									<li className="list-group-item">Nome: {service && removeKebabCase(service?.customer?.name)}</li>
									<li className="list-group-item">Tel: {service && removeKebabCase(service?.customer?.tel)}</li>
									<li className="list-group-item">CPF: {service && removeKebabCase(service?.customer?.cpf)}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-6 mb-4">
					<div className="card h-100 border rounded-3 shadow">
						<div className="card-body">
							<h2 className="card-title">Funcionário(s)</h2>
							{employees.map((employee) => {
								if (employee.services.some((es) => es.serviceId === id)) {
									return (
										<div key={employee?._id} className="card mb-2">
											<ul className="list-group list-group-flush">
												<li className="list-group-item">Nome: {removeKebabCase(employee.name)}</li>
												<li className="list-group-item">Ganho: R$ {toFixed(parseFloat(employee.services.find((es) => es.serviceId === id)?.gain))}</li>
											</ul>
										</div>
									);
								}
								return null;
							})}
						</div>
					</div>
				</div>


				<div className="col-md-6 mb-4">
					<div className="card h-100 border rounded-3 shadow">
						<div className="card-body">
							<h2 className="card-title">Financeiro</h2>
							
							<div className="card mb-2">
								<ul className="list-group list-group-flush">
									<li className="list-group-item">Despesa (geral): R${service && (toFixed(service.expense))}</li>
									<li className="list-group-item">Total gasto com funcionários: R${toFixed(employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, 0))}
									</li>
									<li className="list-group-item">Despesa Total: R${toFixed(employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense)))}
									</li>
								</ul>
							</div>
							
							<div className="card mb-2">
								<ul className="list-group list-group-flush">
									<li className="list-group-item">Lucro bruto: {service?.gain ? toFixed(parseFloat(service?.gain)) : service?.payment.total}</li>
									<li className="list-group-item">Lucro líquido: R${service?.gain ? toFixed(service?.gain - employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense))) : toFixed(service?.payment.payValue - employees.reduce((total, employee) => {
											const se = employee.services.find((es) => es.serviceId === id);
											return se ? total + parseFloat(se.gain) : total;
										}, parseFloat(service?.expense)))}
									</li>
								</ul>
							</div>
							
							<p>Método: {service?.payment.payName}</p>
						</div>
					</div>
				</div>

        </div>
      </div>
	</div>
  )
}

export default ServicePage