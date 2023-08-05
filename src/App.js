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
import Customer from "./pages/Customer/Customer";
import CustomerPage from "./pages/CustomerPage/CustomerPage";
import Service from "./pages/Service/Service";
import ServicePage from "./pages/ServicePage/ServicePage";

// Components
import Header from "./components/Header/Header";


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
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/:id" element={<CustomerPage />} />
          <Route path="/service" element={<Service />} />
          <Route path="/service/:id" element={<ServicePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
