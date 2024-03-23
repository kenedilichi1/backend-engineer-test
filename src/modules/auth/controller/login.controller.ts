import { Request, Response, NextFunction } from "express";
import { Exception } from "../../../utils/error";
import { UserRepository } from "../../user/repository/user.repository";
import { UserService } from "../../user/service/user.service";
import { AuthService } from "../service/auth.service";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";
import { LoginDto } from "../dto/auth.dto";

export function loginMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const verifyHttpRequest = LoginDto.safeParse(request.body);

  if (!verifyHttpRequest.success) {
    throw new Exception(
      "VALIDATION_ERROR",
      verifyHttpRequest.error.issues[0].message,
      verifyHttpRequest.error.name
    );
  }

  const { email, ...rest } = verifyHttpRequest.data;

  request.body = {
    email: email.toLowerCase(),
    ...rest,
  };

  return next();
}

export async function loginController(request: Request, response: Response) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/login'
		 * #swagger.auto = false
		 * #swagger.method = 'POST'
		 * #swagger.tags = ['Auth']
		 * #swagger.summary = 'user login'
		 * #swagger.description = 'user login'
		 * #swagger.operationId = 'login'
		 * #swagger.produces = ['application/json']
         * #swagger.parameters = {
            in:'body',
            description: 'User login credentials', 
            schema: { $ref: '#/definitions/loginSchema'}
        }

		 * #swagger.responses[200] = {
			description: 'login successfully',
			schema: {
				$ref: '#/definitions/authHttpResponse'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 */

    const payload: LoginDto = request.body;
    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const userRepo = new UserRepository(mongoDbInstance);
    const userService = new UserService(userRepo);

    const authService = new AuthService(userService);

    const login = await authService.login(payload);

    return successResponder(response, login, "signup was successful");
  } catch (error) {
    return errorResponder(response, error);
  }
}
