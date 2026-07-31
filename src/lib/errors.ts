export class AppError extends Error {
  constructor(message: string, public code: string = "INTERNAL_ERROR", public statusCode: number = 500) {
    super(message);
    this.name = "AppError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: any) {
    super(message, "DATABASE_ERROR", 500);
    this.name = "DatabaseError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} find nahi ho saka`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}
