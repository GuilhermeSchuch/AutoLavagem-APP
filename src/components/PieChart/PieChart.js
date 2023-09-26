// Charts
import { Chart } from 'react-google-charts';

// Hooks
import { toFixed } from "../../hooks/useToFixed";

const PieChart = ({ data }) => {
  return (
    <div className="shadow text-center col-xl-3 col-md-5 col-12 mb-3 p-2">
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="PieChart"
        loader={<div>Carregando gráfico...</div>}
        data={[
          ['Categoria', 'Quantia'],
          ['Ganho', data.totalGain],
          ['Despesa', data.totalExpense],
        ]}
        options={{
          legend: "none",
          title: `${data.date}`,
          pieStartAngle: 100,
        }}
      />
      <span className="fw">Líquido: R${ toFixed(data.totalGain - data.totalExpense) }</span>
    </div>
  );
};

export default PieChart;
