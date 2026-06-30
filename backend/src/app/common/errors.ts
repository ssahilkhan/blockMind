export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class RpcConnectionError extends AppError {
  constructor(message = 'Unable to connect to Ethereum RPC.') {
    super(503, 'RPC_CONNECTION_FAILED', message);
  }
}

export class RpcRequestError extends AppError {
  constructor(message = 'RPC request failed.') {
    super(502, 'RPC_REQUEST_FAILED', message);
  }
}

export class DatabaseConnectionError extends AppError {
  constructor(message = 'Unable to connect to database.') {
    super(503, 'DATABASE_CONNECTION_FAILED', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(404, 'NOT_FOUND', message);
  }
}
