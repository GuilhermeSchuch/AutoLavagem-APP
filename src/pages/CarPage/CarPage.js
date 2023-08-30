// CSS
import "./CarPage.css";

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { removeKebabCase, removeSpaceCase } from "../../hooks/useRemoveCases";

const CarPage = () => {
	const { plate } = useParams();
	const [car] = useFetch(`/car/${plate}`);
	// console.log(car);

	const [carName, setCarName] = useState('');
	const [carPlate, setCarPlate] = useState('');

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `https://alemaoautolavagem.onrender.com/car/${plate}`,
			data: { name: carName, plate: carPlate },
			// validateStatus: () => true,
			// withCredentials: true
			})
			.then(res => {
			// console.log(res);
			// console.log(res.status);

			if(res.status === 200){
				navigate("/car")
			}
		});
	}

	useEffect(() => {
		if(car){
			setCarName(removeKebabCase(car.name));
			setCarPlate(removeSpaceCase(removeKebabCase((car.plate))).toUpperCase());
		}
	}, [car]);

  return (
    <div className="container">
			<h1>Modificar carro</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Carro</label>
					<input 
						type="text" 
						className="form-control" 
						name="carName"
						placeholder="Insira o carro" 
						autoComplete='off'
						value={carName}
						onChange={(e) => setCarName(e.target.value)}
						autoFocus
					/>
				</div>

				<div className="form-group my-3">
					<label>Placa</label>
					<input 
						type="text" 
						className="form-control" 
						name="carPlate"
						placeholder="Insira a placa" 
						autoComplete='off'
						value={carPlate}
						onChange={(e) => setCarPlate(e.target.value)}
					 />
				</div>

				<button type="submit" className="btn btn-primary">Atualizar</button>
			</form>

			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" onClick={() => navigate("/car")}>Cancelar edição</button>
			</div>
	</div>
  )
}

export default CarPage