import { Request, Response, NextFunction } from "express";
import { VerifyJWT } from "../../../utils/verifyJwt";
import { JwtFor } from "../../../common/dtos";
import { Exception } from "../../../utils/error";
import { UpdateQuery, UpdateQueryDto } from "../dto/product.dto";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";
import { ProductRepository } from "../repository/product.repository";
import { ProductService } from "../service/product.service";

export function updateProductMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const payload = request.body;
  const param = request.params;

  const { jwtFor } = VerifyJWT(request);

  if (jwtFor !== JwtFor.Enum.authorized) {
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Invalid token, please login again"
    );
  }

  const validateRequest = UpdateQuery.safeParse(payload);

  if (!validateRequest.success) {
    throw new Exception(
      "VALIDATION_ERROR",
      validateRequest.error.issues[0].message,
      validateRequest.error.name
    );
  }

  request.body = { ...validateRequest.data, ...param };

  return next();
}

export async function updateProductController(
  request: Request,
  response: Response
) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/product/:productId'
		 * #swagger.auto = false
		 * #swagger.method = 'PUT'
		 * #swagger.tags = ['Product']
		 * #swagger.summary = 'Update product'
		 * #swagger.description = 'Update a product'
		 * #swagger.operationId = 'update-product'
		 * #swagger.produces = ['application/json']
         * #swagger.security = [{"token": []}]
				 
         * #swagger.parameters['productId'] = { in: 'path', description: 'id of the product to be updated'}
		 * #swagger.parameters['body'] = { in: 'body', description: 'Update Data', schema: { $ref: '#/definitions/updateQuery'}}
		 
		 * #swagger.responses[200] = {
			description: 'Product updated successfully', 
			schema: { 
				$ref: '#/definitions/updateResponse'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
	*/

    const { productId, ...rest }: UpdateQueryDto = request.body;
    // TODO: Make sure product price is a valid number
    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const productRepo = new ProductRepository(mongoDbInstance);
    const productService = new ProductService(productRepo);

    const updated = await productService.updateProduct(productId, { ...rest });

    return successResponder(
      response,
      { updated },
      "product updated successfully"
    );
  } catch (error) {
    return errorResponder(response, error);
  }
}
