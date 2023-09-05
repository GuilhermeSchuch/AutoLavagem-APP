// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";

// Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Notifications
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

function App() {
  const setDate = localStorage.getItem('setDate');

  if(setDate){
    const currentTime = Date.now();
    const timeDifference = currentTime - setDate;
    // const oneHourInMilliseconds = 60 * 60 * 1000;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (timeDifference >= oneDayInMilliseconds) {
      localStorage.removeItem('token');
      localStorage.removeItem('setDate');
      window.location.href = "https://alemaoautolavagem.netlify.app/login";
    }
  }

  return (
    <div className="App">
      <ReactNotifications />
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
          <Route path="/finance" element={<Finance />} />
          <Route path='*' element={<NotFound />}/>
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
