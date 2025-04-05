
export class custom_error extends Error{
  constructor(message, code){
    super(message);
    this.code = parseIntWithLeadingZeros(code) || "09"
  }
}

// module.exports = CustomError;

function parseIntWithLeadingZeros(input) {
  if (input[0] === "0") {
    return input;
  } 
  else {
    return parseInt(input, 10).toString();
  }
} 