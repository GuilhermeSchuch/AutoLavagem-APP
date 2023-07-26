// Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// CSS
import bootstrap from 'bootstrap'

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Car from "./pages/Car/Car";
import CarPage from "./pages/CarPage/CarPage";
import Employee from "./pages/Employee/Employee";
import EmployeePage from "./pages/EmployeePage/EmployeePage";

// Components
import Header from "./components/Header/Header";

// Hooks
import useFetch from "./hooks/useFetch";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/car" element={<Car />} />
          <Route path="/car/:plate" element={<CarPage />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/:id" element={<EmployeePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
