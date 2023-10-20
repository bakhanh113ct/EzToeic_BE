import { Expose } from "class-transformer";
import { Response } from "express";

export class ErrorResp extends Error {
  // @Expose()
  readonly status: number;

  // @Expose()
  readonly code: string;

  // @Expose()
  readonly message: string;

  data: any;

  constructor(code: string, message: string, status?: number) {
    super();
    this.status = status || 500;
    this.code = code;
    this.message = message;
    this.stack = undefined;
  }
}

export const Errors = {
  BadRequest: new ErrorResp("error.badRequest", "Bad request", 400),
  Unauthorized: new ErrorResp("error.unauthorized", "Unauthorized", 401),
  Forbidden: new ErrorResp("error.forbiden", "Forbidden", 403),
  Sensitive: new ErrorResp(
    "error.sensitive",
    "An error occurred, please try again later.",
    400
  ),
  NotFound: new ErrorResp("error.notfound", "Not Found", 404),
  Conflict: new ErrorResp("error.conflict", "Conflict ", 409),
  InternalServerError: new ErrorResp(
    "error.internalServerError",
    "Internal server error.",
    500
  ),
  NotFoundUser: new ErrorResp("error.notfounduser", "Not Found User", 404),
  EmailUsed: new ErrorResp("error.emailused", "Email Used", 409),
  InvalidUsernameOrPassword: new ErrorResp(
    "error.invalidusernameorpassword",
    "Invalid Username or Password",
    400
  ),
  wrongPassword: new ErrorResp("error.wrongPassword", "Wrong password", 400),
  NotAllow: new ErrorResp("error.notallow", "You are not allow", 400),
};

export const handleError = (err: Error, res: Response) => {
  if (err instanceof ErrorResp) {
    const errResp = err as ErrorResp;
    res.status(errResp.status || Errors.BadRequest.status).send(errResp);
  } else {
    const errResp = new ErrorResp(
      Errors.InternalServerError.code,
      JSON.stringify(err),
      Errors.InternalServerError.status
    );
    res.status(Errors.Sensitive.status).send(errResp);
  }
};
