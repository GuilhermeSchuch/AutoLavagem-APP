// Axios
import axios from "axios";

// Hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = (url) => {
	const [apiData, setApiData] = useState([]);
	const token = localStorage.getItem('token');

	const navigate = useNavigate();

	// const globalUrl = "https://alemaoautolavagem.onrender.com";
	const globalUrl = "http://localhost:3001";

	const fetchData = async () => {
		try {
			const response = await axios.get(`${globalUrl}${url}`, {
      	headers: { Authorization: 'Bearer ' + token }
			});

			const data = response.data;

			setApiData(data);
		} catch (err) {
			const error = err.response.data.error;

			navigate("/login", { state: { title: "Operação inválida!", message: error } });
		}
	}

    useEffect(() => {
			fetchData();
		}, []);

    return apiData;
}

export default useFetch