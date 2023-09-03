// Router
import { useParams, useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";

const CustomerPage = () => {
	const { id } = useParams();

	const [customer] = useFetch(`/customer/${id}`);
	const cars = useFetch("/car");

	const [name, setName] = useState('');
	const [tel, setTel] = useState('');
	const [cpf, setCpf] = useState('');
	const [car, setCar] = useState([]);
	const [carName, setCarName] = useState('');
	const [plates, setPlates] = useState([]);

	const navigate = useNavigate();

	const token = localStorage.getItem('token');

	// Globals
	// const globalUrl = "http://localhost:3001";
	const globalUrl = "https://alemaoautolavagem.onrender.com";

	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `${globalUrl}/customer/${id}`,
			data: { name, tel, cpf },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 200 && !res.data.error){
				navigate("/customer");
			}
		})
		.catch((err) => {
			navigate("/customer", { state: { title: "Operação não realizada!", message: err.response.data.error } });
		});
	}

	const handleAddCars = (e) => {
		e.preventDefault();
		
		axios({
			method: 'PUT',
			url: `${globalUrl}/customer/addcars/${id}`,
			data: { plates },
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
		if(customer){
			setName(removeKebabCase(customer.name));
			setTel(removeSpaceCase(removeKebabCase((customer.tel))).toUpperCase());
			setCpf(removeSpaceCase(removeKebabCase((customer.cpf))).toUpperCase());
			setCar(customer.car);
		}
	}, [customer]);

  return (
    <div className="container">
			<h1>Modificar Cliente</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Nome</label>
					<input 
						type="text" 
						className="form-control" 
						name="name"
						placeholder="Insira o nome" 
						autoComplete='off'
						value={name}
						onChange={(e) => setName(e.target.value)}
						autoFocus
					/>
				</div>

				<div className="form-group my-3">
					<label>Telefone</label>
					<input 
						type="text" 
						className="form-control" 
						name="tel"
						placeholder="Insira o telefone" 
						autoComplete='off'
						value={tel}
						onChange={(e) => setTel(e.target.value)}
					/>
				</div>

				<div className="form-group mb-3">
					<label>CPF</label>
					<input 
						type="text" 
						className="form-control" 
						name="cpf"
						placeholder="Insira o telefone" 
						autoComplete='off'
						value={cpf}
						onChange={(e) => setCpf(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn btn-primary">Atualizar</button>
			</form>


			<div className="btn-group mt-2">
				<button className="btn btn-info dropdown-toggle" type="button" id="dropdownMenuClickableInside" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
					Modificar carro(s) linkado(s) a esse cliente
				</button>

				<ul className="dropdown-menu" aria-labelledby="dropdownMenuClickableInside">
					<form onSubmit={handleAddCars}>
						{cars.map((car) => (
								<li key={car.plate}>
									<label className="dropdown-item">
										<input 
											className="me-1" 
											type="checkbox" 
											name="plate" 
											id="flexRadioDefault1"
											
											onChange={(e) => setPlates(plates.indexOf(car.plate) > -1 ? plates.filter(item => item !== car.plate) : plates => [...plates, car.plate])}
											
											// console.log(arr.indexOf("bob") > -1); //true
											// checked={plates.map((plate) => (
											// 	// console.log(`plate: ${plate} car.plate: ${car.plate}`)
											// 	plate === car.plate ? true : false
												
											// ))}
										/>
										{ removeSpaceCase(removeKebabCase((car.plate))).toUpperCase() }
									</label>
								</li>
						))}

						<button type="submit" className="btn btn-primary dropdown-item">Linkar</button>	
					</form>
					{/* <li><a class="dropdown-item" href="#">Menu item</a></li>
					<li><a class="dropdown-item" href="#">Menu item</a></li>
					<li><a class="dropdown-item" href="#">Menu item</a></li> */}
				</ul>
			</div>

			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={() => navigate("/customer")}>Cancelar edição</button>
			</div>
			
		</div>
  )
}

export default CustomerPage