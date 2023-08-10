// Chart
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// CSS
import "./Finance.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from 'react';
import { convert } from "../../hooks/useConvertIsoDate";

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

const Finance = () => {
  const services = useFetch("/service");
  const employees = useFetch("/employee");
  // console.log(services);

  const [totalGain, setTotalGain] = useState(0);
  const [totalExpense, setTotalExpense] = useState('');

  console.log(`totalGain: ${totalGain}`);

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

  // Convert dailyData object to an array of objects
  const dailyDataArray = Object.values(dailyData);





  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    calculateMonthlyData();
  }, []);

  const calculateMonthlyData = () => {
    const monthlyDataMap = {};

    // Add employees' gains to monthlyDataMap
    employees.forEach(employee => {
      employee.services.forEach(employeeService => {
        const service = services.find(service => service._id === employeeService.serviceId);
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


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF0000', '#00FF00', '#0000FF'];


  return (
    <div className="container">
      <h1>Últimos Ganhos</h1>

      <ResponsiveContainer aspect={1.9}>
        <LineChart
          width={730}
          height={250}
          data={dailyDataArray}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => `Data: ${label}`} // Custom label format for tooltip
          />
          <Legend />
          <Line type="monotone" dataKey="totalGain" stroke="#00A33E" name="Ganho" />
          <Line type="monotone" dataKey="totalExpense" stroke="#F02318" name="Despesa" />
        </LineChart>
      </ResponsiveContainer>
    






    </div>
  )
}

export default Finance