// CSS
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className='notFoundContainer'>
      <h1>Erro 404</h1>
      <p>A página que você está procurando pode ter sido removida, ter tido o nome trocado, ou pode estar temporariamente inacessível.</p>
      <p>Voltar para o <a href="/">início</a>.</p>
    </div>
  )
}

export default NotFound


