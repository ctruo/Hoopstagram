//Middleware function
//Makes sure form is not empty upon submission
const isValidRequest = (req, res, next) => {
    let valid = true;
    for (const field in req.body) {
      if (req.body[field].length == 0) {
        valid = false;
        break;
      }
    }
  
    if (valid) {
      next();
    } else {
      res.status(422).send({ errorMsg: "Empty form submitted" });
    }
  };
  
  module.exports = isValidRequest;