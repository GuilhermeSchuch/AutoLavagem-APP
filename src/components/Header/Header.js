// CSS
import "./Header.css";

// Router
import { useParams, useNavigate, NavLink, useLocation, Link } from 'react-router-dom';


// Cookie
import Cookies from 'js-cookie';

const Header = () => {
  // console.log(Cookies.get("user"));
  const location = useLocation();

  return (
    <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            {/* <svg className="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg> */}
            <span className="fs-4">Alemão Auto Lavagem</span>
        </a>

        <ul className="nav nav-pills">
            <li className="nav-item">
              <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Início</Link>
            </li>

            <li className="nav-item">
              <Link to="/car" className={location.pathname === '/car' ? 'nav-link active' : 'nav-link'}>Carros</Link>
            </li>

            <li className="nav-item">
              <Link to="/employee" className={location.pathname === '/employee' ? 'nav-link active' : 'nav-link'}>Funcionários</Link>
            </li>

            <li className="nav-item">
              <Link to="/service" className={location.pathname === '/service' ? 'nav-link active' : 'nav-link'}>Serviços</Link>
            </li>

            {/* <li className="nav-item"><a href="#" className="nav-link active" aria-current="page">Home</a></li> */}
            <li className="nav-item"><a href="/login" className="nav-link">Login</a></li>
        </ul>
        </header>
    </div>
  )
}

export default Header