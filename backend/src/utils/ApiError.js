class ApiError extends Error{
  constructor(
    statusCode,
    message,
    errors = [],
    stack
  )
  {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.errors = errors

        if(stack){
          this.stack = stack
        }

  }
}

export default ApiError
