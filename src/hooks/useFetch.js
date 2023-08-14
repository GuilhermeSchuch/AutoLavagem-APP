// Axios
import axios from "axios";

// Hooks
import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [apiData, setApiData] = useState([]);

	const fetchData = async () => {
		try {
			const response = await axios.get(`https://alemaoautolavagem.onrender.com${url}`);
			const data = response.data;
			setApiData(data);
		} catch (error) {
			console.log(error);
		}
	}

    useEffect(() => {
		fetchData();
	}, []);

    return apiData;
}

export default useFetch