//err: information before request.
//req: Request
//res: Response
//next: What happens after

//Create a subscription -> middleware (check for errors) -> controller for creating subscription

// Some blocks of code, that is executed before or after something is happening that will allow us to intercept what is happening

const errorMiddleWare = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;

    console.error(err);

    //Mongoose bad ObjectID
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
      // Extract all error messages from the 'err.errors' object and map them to an array of strings.
      // For example, if err.errors = {
      //   name: { message: "Name is required" },
      //   email: { message: "Email is invalid" }
      // }
      // Then Object.values(err.errors).map((val) => val.message) will return:
      // ["Name is required", "Email is invalid"]
      const message = Object.values(err.errors).map((val) => val.message);

      // Join all error messages into a single string and create a new Error object with that message.
      // The final error message will be: "Name is required, Email is invalid"
      error = new Error(message.join(", "));

      error.statusCode = 400;
    }

    //.status() sets the HTTP response code (in headers).
    //.json() sends the actual data (as a JSON-formatted response body).
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleWare;
