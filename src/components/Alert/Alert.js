const Alert = ({ text }) => {
  return (
    <div class="alert alert-danger d-flex align-items-center" role="alert">
      <div>
          { text }
      </div>
  </div>
  )
}

export default Alert