import { Request, Response, NextFunction } from "express";
import { Exception } from "../../../utils/error";
import { VerifyJWT } from "../../../utils/verifyJwt";
import { JwtFor } from "../../../common/dtos";
import { ProductRepository } from "../repository/product.repository";
import { ProductService } from "../service/product.service";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";

export function getProductMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { jwtFor } = VerifyJWT(request);

  if (jwtFor !== JwtFor.Enum.authorized) {
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Invalid token, please login again"
    );
  }

  const query = request.params;

  request.body = query;

  return next();
}

export async function getProductController(
  request: Request,
  response: Response
) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/product/:productId'
		 * #swagger.auto = false
		 * #swagger.method = 'GET'
		 * #swagger.tags = ['Product']
		 * #swagger.summary = 'Get product'
		 * #swagger.description = 'Get product  '
		 * #swagger.operationId = 'get-product'
		 * #swagger.produces = ['application/json']
		 * #swagger.security = [{"token": []}]

		 * #swagger.consumes = ['application/json']
		 * #swagger.parameters['productId'] = {in: 'path', description: 'product to be fetched', required: true, type: 'string'}
		
		 * #swagger.responses[200] = {
			description: 'fetched product successfully',
			schema: {
				$ref: '#/definitions/product'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
	*/

    const payload: {
      productId: string;
    } = request.body;

    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const productRepo = new ProductRepository(mongoDbInstance);
    const productService = new ProductService(productRepo);

    const product = await productService.fetchOneProduct(payload.productId);

    return successResponder(response, product);
  } catch (error) {
    return errorResponder(response, error);
  }
}
