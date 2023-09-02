// Router
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('setDate');

    navigate("/", { state: { title: "Você está desconectado!" } });
  };

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">  
          <span className="fs-4">Alemão Auto Lavagem</span>
        </a>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link to="/customer" className={location.pathname === '/customer' ? 'nav-link active' : 'nav-link'}>{ window.innerWidth >= 992 ? 'Clientes' : <img src="/icons/customer.png" alt="Clientes" width="20" height="20" /> }</Link>
          </li>

          <li className="nav-item">
            <Link to="/car" className={location.pathname === '/car' ? 'nav-link active' : 'nav-link'}>{ window.innerWidth >= 992 ? 'Carros' : <img src="/icons/car.png" alt="Carros" width="20" height="20" /> }</Link>
          </li>

          <li className="nav-item">
            <Link to="/employee" className={location.pathname === '/employee' ? 'nav-link active' : 'nav-link'}>{ window.innerWidth >= 992 ? 'Funcionários' : <img src="/icons/employee.png" alt="Funcionários" width="20" height="20" /> }</Link>
          </li>

          <li className="nav-item">
            <Link to="/service" className={location.pathname === '/service' ? 'nav-link active' : 'nav-link'}>{ window.innerWidth >= 992 ? 'Serviços' : <img src="/icons/service.png" alt="Serviços" width="20" height="20" /> }</Link>
          </li>

          <li className="nav-item">
            <Link to="/finance" className={location.pathname === '/finance' ? 'nav-link active' : 'nav-link'}>{ window.innerWidth >= 992 ? 'Financeiro' : <img src="/icons/finance.png" alt="Financeiro" width="20" height="20" /> }</Link>
          </li>

          {token ? <li className="nav-item"><a href="/" className="nav-link" onClick={(handleLogout)}>Sair</a></li> : <li className="nav-item"><a href="/login" className="nav-link">Entrar</a></li>}
        </ul>
      </header>
    </div>
  )
}

export default Header