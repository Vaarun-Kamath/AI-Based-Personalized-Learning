class CustomError extends Error {
  constructor({ status, errorCode, errorMessage }) {
    super(errorMessage);
    this.status = status;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

const Errors = {
  BAD_REQUEST: new CustomError({
    status: 400,
    errorCode: 'BAD_REQUEST',
    errorMessage: 'Please provide the required fields.',
  }),
  BAD_REQUEST_DATATYPE: new CustomError({
    status: 400,
    errorCode: 'BAD_REQUEST_DATATYPE',
    errorMessage: 'Please check the fields.',
  }),
  SERVER_ERROR: new CustomError({
    status: 500,
    errorCode: 'SERVER_ERROR',
    errorMessage: 'Internal server error.',
  }),
  UNAUTHORIZED: new CustomError({
    status: 402,
    errorCode: 'UNAUTHORIZED',
    errorMessage: 'You are not authorized to access this resource.',
  }),
  INCORRECT_CREDENTIALS: new CustomError({
    status: 401,
    errorCode: 'INCORRECT_CREDENTIALS',
    errorMessage: 'Incorrect username or password.',
  }),
  NOT_FOUND: new CustomError({
    status: 404,
    errorCode: 'NOT_FOUND',
    errorMessage: 'User not found.',
  }),
  NOT_FOUND_APPLICATION: new CustomError({
    status: 404,
    errorCode: 'NOT_FOUND',
    errorMessage: 'No application found',
  }),
  NOT_FOUND_DETAILS: new CustomError({
    status: 404,
    errorCode: 'NOT_FOUND',
    errorMessage: 'No details submitted',
  }),
  DETAILS_EXIST: new CustomError({
    status: 409,
    errorCode: 'CONFLICT',
    errorMessage: 'Details already submitted',
  }),
  FORBIDDEN: new CustomError({
    status: 403,
    errorCode: 'FORBIDDEN',
    errorMessage: "You don't have permission to access this resource.",
  }),
  FORBIDDEN_STATUS: new CustomError({
    status: 403,
    errorCode: 'FORBIDDEN',
    errorMessage: 'Your application is not approved',
  }),
  UNPROCESSABLE: new CustomError({
    status: 422,
    errorCode: 'UNPROCESSABLE',
    errorMessage: 'Unable to process the contained instructions',
  }),
  CONFLICT: new CustomError({
    status: 409,
    errorCode: 'CONFLICT',
    errorMessage: 'User already exists',
  }),
};

module.exports = Errors;
