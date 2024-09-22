class Response {
    constructor(statuscode, message = '', data , success = true, ) {
      this.statuscode = statuscode
      this.message = message;
      this.data = data;
      this.success = success;
    }
}

export default Response;