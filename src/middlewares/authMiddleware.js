const isAuthenticated = () => {
  const setDate = localStorage.getItem('setDate');

  if(setDate){
    const currentTime = Date.now();
    const timeDifference = currentTime - setDate;
    const oneHourInMilliseconds = 60 * 60 * 1000;

    if (timeDifference >= oneHourInMilliseconds) {
      localStorage.removeItem('token');
      localStorage.removeItem('setDate');
      window.location.href = "http://localhost:3000/login";
    }
  }
};

export default isAuthenticated;