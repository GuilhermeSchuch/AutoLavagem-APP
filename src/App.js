// Router
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

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
import Finance from "./pages/Finance/Finance";

// Components
import Header from "./components/Header/Header";

// Middlewares
import isAuthenticated from "./middlewares/authMiddleware";

const auth = isAuthenticated();


function App() {
  

  return (
    <div className="App">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={auth ? <Home /> : <Login />} />
          <Route path="/login" element={!auth ? <Login /> : <Home />} />
          <Route path="/car" element={auth ? <Car /> : <Login />} />
          <Route path="/car/:plate" element={auth ? <CarPage /> : <Login />} />
          <Route path="/employee" element={auth ? <Employee /> : <Login />} />
          <Route path="/employee/:id" element={auth ? <EmployeePage /> : <Login />} />
          <Route path="/customer" element={auth ? <Customer /> : <Login />} />
          <Route path="/customer/:id" element={auth ? <CustomerPage /> : <Login />} />
          <Route path="/service" element={auth ? <Service /> : <Login />} />
          <Route path="/service/:id" element={auth ? <ServicePage /> : <Login />} />
          <Route path="/finance" element={auth ? <Finance /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
