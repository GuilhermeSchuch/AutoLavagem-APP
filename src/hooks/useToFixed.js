const toFixed = (number)  => {
  if (Number.isNaN(number)) {
    return "Invalid number";
  }

  if (number % 1 === 0) {
    return number.toFixed(2);
  } else {
    const decimalPart = (number.toString().split(".")[1] || "").slice(0, 2);
    return number.toString().split(".")[0] + "." + decimalPart.padEnd(2, "0");
  }
}

export { toFixed }