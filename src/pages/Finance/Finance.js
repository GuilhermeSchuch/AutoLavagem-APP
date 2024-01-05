// CSS
import "./Finance.css";

// Axios
import axios from "axios";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from 'react';
import { convert } from "../../hooks/useConvertIsoDate";
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import PieChart from "../../components/PieChart/PieChart";
import Loader from "../../components/Loader/Loader";

// SheetJs
import * as XLSX from 'xlsx'

// Google Charts
import { Chart } from 'react-google-charts';

const Finance = () => {
  // Globals
	const URL = "http://localhost:3001";

  const token = localStorage.getItem('token');

  const navigate = useNavigate();
  const location = useLocation();

  const services = useFetch("/service");
  const employees = useFetch("/employee");

  const [totalGain, setTotalGain] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (services) {
      let totalGainSum = 0;

      services.forEach((service) => {
        if (service.gain !== null) {
          totalGainSum += service.gain;
        }
        else{
          totalGainSum += parseFloat(service.payment.payValue);
        }
      });
      setTotalGain(totalGainSum);
    }
  }, [services]);

  const dailyData = services.reduce((result, service) => {
    const date = convert(service.createdAt);

    if (!result[date]) {
      result[date] = {
        date,
        totalGain: 0,
        totalExpense: 0,
      };
    }

    // Calculate total gain
    if (service.gain !== null) {
      result[date].totalGain += service.gain;
    } else if (service.payment.payValue) {
      result[date].totalGain += parseFloat(service.payment.payValue);
    }

    // Calculate total expense
    result[date].totalExpense += service.expense;

    // Calculate employee gains
    employees.forEach((employee) => {
      employee.services.forEach((employeeService) => {
        if (employeeService.serviceId.toString() === service._id.toString()) {
          result[date].totalExpense += parseFloat(employeeService.gain);
        }
      });
    });

    return result;
  }, {});

  const dailyDataArray = Object.values(dailyData);

  useEffect(() => {
    calculateMonthlyData();
  }, [services, employees]);

  const calculateMonthlyData = () => {
    const monthlyDataMap = {};

    employees.forEach(employee => {
      employee?.services.forEach(employeeService => {
        const service = services.find(service => service?._id === employeeService?.serviceId);
        if (service) {
          const createdAt = new Date(service.createdAt);
          const year = createdAt.getFullYear();
          const month = String(createdAt.getMonth() + 1).padStart(2, '0');
          const date = `${month}/${year}`;

          const gain = parseFloat(employeeService.gain) || 0;

          if (!monthlyDataMap[date]) {
            monthlyDataMap[date] = { totalGain: 0, totalExpense: 0 };
          }

          monthlyDataMap[date].totalExpense += gain;
        }
      });
    });

    // Add services' gains and expenses to monthlyDataMap
    services.forEach(service => {
      const createdAt = new Date(service.createdAt);
      const year = createdAt.getFullYear();
      const month = String(createdAt.getMonth() + 1).padStart(2, '0');
      const date = `${month}/${year}`;

      const gain = service.gain || parseFloat(service.payment.payValue) || 0;
      const expense = parseFloat(service.expense) || 0;

      if (!monthlyDataMap[date]) {
        monthlyDataMap[date] = { totalGain: 0, totalExpense: 0 };
      }

      monthlyDataMap[date].totalGain += gain;
      monthlyDataMap[date].totalExpense += expense;
    });

    const result = Object.entries(monthlyDataMap).map(([date, { totalGain, totalExpense }]) => ({
      date,
      totalGain,
      totalExpense,
    }));

    setMonthlyData(result);
  };

  // Convert dailyData object to an array of arrays for Line Chart data
  const chartData = [['Data', 'Ganho', 'Despesa', 'Líquido']];

  Object.values(dailyData).forEach((data) => {
    chartData.push([data.date, data.totalGain, data.totalExpense, data.totalGain - data.totalExpense]);
  });
  
  const pieData = [["Name", "Value"]];

  for (const obj of monthlyData) {
    const { totalGain, totalExpense } = obj;
    pieData.push(["Ganho", totalGain]);
    pieData.push(["Despesa", totalExpense]);
  }

  useEffect(() => {
    setTimeout(() => {
      setShowChart(true);
    }, 1500)
  }, []);


  const generateXLSX = (data) => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet");
    XLSX.writeFile(wb, "Planilha.xlsx");
  }

  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [serviceDate, setServiceDate] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
			method: 'GET',
			url: `${URL}/service/${initialDate}/${finalDate}`,
			headers: { Authorization: 'Bearer ' + token }
		})
		.then(res => {
			if(res.status === 200 && !res.data.error){
				setServiceDate(res.data);
        generateXLSX(res.data);
			}
		})
		.catch((err) => {
			navigate("/", { state: { title: "Operação não realizada!", message: err.response.data.error, type: "danger" } });
		});
  }


  const [chartWidth, setChartWidth] = useState('100%');
  const [chartHeight, setChartHeight] = useState('500px');  

  useEffect(() => {
    // Function to update chart dimensions based on window width
    const updateChartDimensions = () => {
      if (window.innerWidth < 768) {
        setChartWidth('100%');
        setChartHeight('300px');
      } 
      else if(window.innerWidth > 1400){
        setChartWidth('100%');
        setChartHeight('700px');
      }
      else{
        setChartWidth('100%');
        setChartHeight('500px');
      }
    };

    // Listen for window resize events
    window.addEventListener('resize', updateChartDimensions);

    // Initial chart dimensions
    updateChartDimensions();

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', updateChartDimensions);
    };
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="d-flex flex-column">
          <h1>Últimos Ganhos</h1>

          <div className="shadow">
            {showChart && (
              <Chart
                width={chartWidth}
                height={chartHeight}
                chartType="LineChart"
                loader={<div>Carregando gráfico</div>}
                data={chartData}
                options={{
                  title: 'Ganhos e despesas',
                  hAxis: { title: 'Data' },
                  xAxis: { title: 'Quantia' },
                  explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal',
                    keepInBounds: false,
                  },
                }}
              />
            )}
            
          </div>
        </div>
      
        <div className="mt-5">
          <h1>Ganhos Mensais</h1>
          <div className="d-flex flex-wrap col-12">
            {monthlyData.map((item, index) => (
              <PieChart key={index} data={item} />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h1>Gerar Planilha</h1>

          <form onSubmit={handleSubmit} className="col-md-3">
            <div className="form-group">
              <label>Data Inicial</label>
              <input 
                type="date" 
                className="form-control mb-3" 
                name="initialDate"                
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data Final</label>
              <input 
                type="date" 
                className="form-control mb-3" 
                name="initialDate"                
                value={finalDate}
                onChange={(e) => setFinalDate(e.target.value)}
                required
              />
            </div>

            {!loading ? (
              <button type="submit" className="btn btn-primary col-5" onClick={((e) => handleSubmit(e))}>Gerar</button>
            ) : (
              <Loader />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Finance