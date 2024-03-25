import { Request, Response, NextFunction } from "express";
import { VerifyJWT } from "../../../utils/verifyJwt";
import { JwtFor } from "../../../common/dtos";
import { Exception } from "../../../utils/error";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";
import { ProductRepository } from "../repository/product.repository";
import { ProductService } from "../service/product.service";

export function deleteProductMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const param = request.params;

  const { jwtFor } = VerifyJWT(request);

  if (jwtFor !== JwtFor.Enum.authorized) {
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Invalid token, please login again"
    );
  }

  request.body = { ...param };

  return next();
}

export async function deleteProductController(
  request: Request,
  response: Response
) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/product/:productId'
		 * #swagger.auto = false
		 * #swagger.method = 'DELETE'
		 * #swagger.tags = ['Product']
		 * #swagger.summary = 'Delete product'
		 * #swagger.description = 'Delete a product'
		 * #swagger.operationId = 'delete-product'
		 * #swagger.produces = ['application/json']
         * #swagger.security = [{"token": []}]
				 
         * #swagger.parameters['productId'] = { in: 'path', description: 'id of the product to be deleted'}
		 
		 * #swagger.responses[200] = {
			description: 'deleted product successfully', 
			schema: { 
				$ref: '#/definitions/deletedResponse'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
	*/

    const { productId } = request.body;

    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const productRepo = new ProductRepository(mongoDbInstance);
    const productService = new ProductService(productRepo);

    const deleted = await productService.deleteProduct(productId);

    return successResponder(
      response,
      { deleted },
      "product deleted successfully"
    );
  } catch (error) {
    return errorResponder(response, error);
  }
}
