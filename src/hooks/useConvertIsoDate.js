const convert = (isoDate) => {
  var date = new Date(isoDate);
  return date.toLocaleDateString('pt-br');
}

export { convert }