// AppError.js
class apiError extends Error {
    constructor(message, statusCode, success) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Indicates that this error is known and handled
      this.success = false;;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default apiError;
  