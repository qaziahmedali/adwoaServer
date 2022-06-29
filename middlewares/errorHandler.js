import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data;
  if(DEBUG_MODE === "true"){
    console.log("debug mode")
    data = {
      message: "Internal server error",
      orginalError: err.message,
    };
  }else{
    data = {
      message: "Internal server error",
    };
  }
  if (err instanceof ValidationError) {
    statusCode = 422; // use for validation error
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
