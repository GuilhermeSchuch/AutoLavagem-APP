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
	const token = localStorage.getItem('token');

	const [car] = useFetch(`/car/${plate}`);

	const [carName, setCarName] = useState('');
	const [carPlate, setCarPlate] = useState('');

	const navigate = useNavigate();

	// Globals
	const globalUrl = "http://localhost:3001";
	// const globalUrl = "https://alemaoautolavagem.onrender.com";

	const handleSubmit = (e) => {
		e.preventDefault();

		axios({
			method: 'PUT',
			url: `${globalUrl}/car/${plate}`,
			data: { name: carName, plate: carPlate },
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 200 && !res.data.error){
				navigate("/car", { state: { title: "Operação realizada com sucesso!", message: res.data.msg } });
			}
		})
		.catch((err) => {
			navigate("/car", { state: { title: "Operação não realizada!", message: err.response.data.error } });
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