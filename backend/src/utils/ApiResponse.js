class ApiResponse {
      constructor(
        statusCode,
        data ,
        message = "success",
      )
            {
                  this.message = message
                  this.status = statusCode
                  this.data = data

            }
}

export default ApiResponse
