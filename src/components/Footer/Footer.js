// CSS
import "./Footer.css";

const Footer = () => {
  return (
    <div className="container footer">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
            <img src="/logo/logo.png" alt="" className="bi" width="30" height="24" />
          </a>
          <span className="mb-3 mb-md-0 text-body-secondary">© 2023 Guilherme Schuch</span>
        </div>
      </footer>
    </div>
  )
}

export default Footer