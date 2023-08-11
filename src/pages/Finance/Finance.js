// CSS
import "./Finance.css";

// Hooks
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from 'react';
import { convert } from "../../hooks/useConvertIsoDate";

// Google Charts
import { Chart } from 'react-google-charts';


const Finance = () => {
  const services = useFetch("/service");
  const employees = useFetch("/employee");
  // console.log(services);

  const [totalGain, setTotalGain] = useState(0);
  const [totalExpense, setTotalExpense] = useState('');

  

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


  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    calculateMonthlyData();
  }, [services, employees]);

  const calculateMonthlyData = () => {
    const monthlyDataMap = {};

    employees.forEach(employee => {
      employee?.services.forEach(employeeService => {
        const service = services.find(service => service?._id === employeeService?.serviceId);
        if (service) {
          console.log(service);
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
  const chartData = [['Data', 'Ganho', 'Despesa']];
  Object.values(dailyData).forEach((data) => {
    chartData.push([data.date, data.totalGain, data.totalExpense]);
  });


  const pieData = [["Name", "Value"]];

  for (const obj of monthlyData) {
    const { totalGain, totalExpense } = obj;
    pieData.push(["Ganho", totalGain]);
    pieData.push(["Despesa", totalExpense]);
  }

  return (
    <div className="container">
      <div className="row">
        <div>
          <h1>Últimos Ganhos</h1>
            <Chart
              width={'100%'}
              height={'400px'}
              chartType="Line"
              loader={<div>Carregando gráfico</div>}
              data={chartData}
              options={{
                title: 'Ganhos e despesas',
                hAxis: { title: 'Data' },
                vAxis: { title: 'Quantia' }
              }}
            />
        </div>
      
        <div className="mt-5">
          <h1>Ganhos Mensais</h1>
          {monthlyData && monthlyData.map((data, index) => (
            <div key={index} className="shadow text-center col-sm-3">
              <Chart
                chartType="PieChart"
                data={pieData}
                options={{
                  legend: "none",
                  title: `${data.date}`,
                  pieStartAngle: 100,
                }}
                width={"100%"}
                height={"400px"}
              />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Finance