// CSS
import "./CustomerPage.css";

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
	// console.log([customer.car]);
	// console.log(customersCars);

	const [name, setName] = useState('');
	const [tel, setTel] = useState('');
	const [cpf, setCpf] = useState('');
	const [car, setCar] = useState([]);

	const [carName, setCarName] = useState('');
	const [plates, setPlates] = useState([]);

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `http://localhost:3001/customer/${id}`,
			data: { name, tel, cpf },
			validateStatus: () => true,
			withCredentials: true
			})
			.then(res => {
			console.log(res);
			console.log(res.status);

			if(res.status === 200){
				navigate("/customer");
			}
		});
	}

	const handleAddCars = (e) => {
		e.preventDefault();
		console.log();
		axios({
			method: 'PUT',
			url: `http://localhost:3001/customer/addcars/${id}`,
			data: { plates },
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
		if(customer){
			setName(removeKebabCase(customer.name));
			setTel(removeSpaceCase(removeKebabCase((customer.tel))).toUpperCase());
			setCpf(removeSpaceCase(removeKebabCase((customer.cpf))).toUpperCase());
			setCar(customer.car);
		}

		if(car){
			const customersCars = car;

			// {customersCars.map((cc, index) => (
			// 	cars.map((car) => (
			// 		cc.plate == car.plate ? setPlates([cc.plate]) : ''
			// 	))
			// ))}
			// setTheArray(oldArray => [...oldArray, newElement]);
		}
	}, [customer, car]);

	// console.log(plates.filter((item,
	// 	index) => plates.indexOf(item) === index));
	console.log(plates);

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


			<div class="btn-group mt-2">
				<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuClickableInside" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
					Modificar carro(s) linkado(s) à esse cliente
				</button>

				<ul class="dropdown-menu" aria-labelledby="dropdownMenuClickableInside">
					<form onSubmit={handleAddCars}>
						{cars.map((car) => (
								<li>
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