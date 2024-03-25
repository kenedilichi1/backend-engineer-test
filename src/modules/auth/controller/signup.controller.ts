import { Request, Response, NextFunction } from "express";
import { User } from "../../user/dto/user.dto";
import { Exception } from "../../../utils/error";
import { UserRepository } from "../../user/repository/user.repository";
import { UserService } from "../../user/service/user.service";
import { AuthService } from "../service/auth.service";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";

export function signupMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const verifyHttpRequest = User.safeParse(request.body);

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

export async function signupController(request: Request, response: Response) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/signup'
		 * #swagger.auto = false
		 * #swagger.method = 'POST'
		 * #swagger.tags = ['Auth']
		 * #swagger.summary = 'user signup'
		 * #swagger.description = 'user signup'
		 * #swagger.operationId = 'signup'
		 * #swagger.produces = ['application/json']
     * #swagger.parameters = {
            in:'body',
            description: 'Signup  credentials', 
            schema: { $ref: '#/definitions/user'}
        }

		 * #swagger.responses[200] = {
			description: 'signup successfully',
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
    const payload: User = request.body;
    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const userRepo = new UserRepository(mongoDbInstance);
    const userService = new UserService(userRepo);

    const authService = new AuthService(userService);

    const signup = await authService.signup(payload);

    return successResponder(response, signup, "signup was successful");
  } catch (error) {
    return errorResponder(response, error);
  }
}
