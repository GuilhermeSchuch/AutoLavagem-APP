// CSS
import "./ServicePage.css";

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { convert } from "../../hooks/useConvertIsoDate";
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

      <div class="container my-5">
        <header class="pb-3 mb-4 border-bottom">
          <div href="#" class="d-flex align-items-center text-body-emphasis text-decoration-none">

            <span class="fs-4">Dados ({ convert(service?.createdAt) })</span>
          </div>
        </header>

        <div class="row align-items-md-stretch">
          <div class="col-md-6 mb-3">
            <div class="h-100 p-5 bg-body-tertiary border rounded-3">
              <h2>Cliente</h2>
              <p>Nome: { service && removeKebabCase(service?.customer?.name) }</p>
              <p>Tel: { service && removeKebabCase(service?.customer?.tel) }</p>
              <p>CPF: { service && removeKebabCase(service?.customer?.cpf) }</p>
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <div class="h-100 p-5 bg-body-tertiary border rounded-3">
              <h2>Funcionário(s)</h2>
              {employees.map((employee) => (
								<div key={employee?._id}>
									<p>{employee.services.some((es) => es.serviceId === id) ? "Nome: " + removeKebabCase(employee.name) : ''}</p>
									{/* <p>Ganho: {employee.services.some((es) => es.serviceId === id ? console.log(es.gain) : console.log("Id do funcionário não condiz com id do parâmetro"))}</p> */}
									
									<p>{employee.services.some((es) => es.serviceId === id) ? 
										`Ganho: R$${parseFloat(employee.services.find((es) => es.serviceId === id)?.gain).toFixed(2)}` : ''
									}</p>


								</div>
							))}


              
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <div class="h-100 p-5 bg-body-tertiary border rounded-3">
              <h2>Financeiro</h2>
              <p>Dispesa (geral): R${ service && (service.expense).toFixed(2) }</p>
              
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
							<p>Total gasto com funcionários: R${
								employees.reduce((total, employee) => {
									const se = employee.services.find((es) => es.serviceId === id);
									return se ? total + parseFloat(se.gain) : total;
								}, 0).toFixed(2)
							}</p>

							<p>Dispesa Total: R${
								employees.reduce((total, employee) => {
									const se = employee.services.find((es) => es.serviceId === id);
									return se ? total + parseFloat(se.gain) : total;
								}, parseFloat(service?.expense)).toFixed(2)
							}</p>

							<p>Lucro bruto: { parseFloat(service.gain).toFixed(2) }</p>
							<p>Lucro líquido: R${
								service.gain - employees.reduce((total, employee) => {
									const se = employee.services.find((es) => es.serviceId === id);
									return se ? total + parseFloat(se.gain) : total;
								}, parseFloat(service?.expense)).toFixed(2)
							}</p>

              
            </div>
          </div>
        </div>
      </div>
	</div>
  )
}

export default ServicePage