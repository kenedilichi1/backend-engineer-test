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
import { parsePaginationCursor } from "../../../utils/validate_pagination_cursors";
import {
  IPagerFirst,
  IPagerNext,
  IPagerPrevious,
} from "../../../common/interface/pagination";

export function getProductsMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { userId, jwtFor } = VerifyJWT(request);

  if (jwtFor !== JwtFor.Enum.authorized) {
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Invalid token, please login again"
    );
  }

  const pager = parsePaginationCursor(request.query as any);

  request.body = {
    userId,
    pager,
  };

  return next();
}

export async function getProductsController(
  request: Request,
  response: Response
) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/products'
		 * #swagger.auto = false
		 * #swagger.method = 'GET'
		 * #swagger.tags = ['Product']
		 * #swagger.summary = 'Get products'
		 * #swagger.description = 'Get products with pagination '
		 * #swagger.operationId = 'get-products'
		 * #swagger.produces = ['application/json']
		 * #swagger.security = [{"token": []}]

		 * #swagger.consumes = ['application/json']
		 * #swagger.parameters['limit'] = {in: 'query', description: 'Number of products to fetch per request', required: true, type: 'string'}
		 * #swagger.parameters['before'] = {in: 'query', description: 'Fetch all products before this ID', required: false, type: 'string'}
		 * #swagger.parameters['after'] = {in: 'query', description: 'Fetch all products After this ID', required: false, type: 'string'}

		 * #swagger.responses[200] = {
			description: 'fetched product successfully',
			schema: {
				$ref: '#/definitions/productsHttpRes'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 */

    const payload: {
      userId: string;
      pager: IPagerFirst | IPagerNext | IPagerPrevious;
    } = request.body;

    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const productRepo = new ProductRepository(mongoDbInstance);
    const productService = new ProductService(productRepo);

    const products = await productService.fetchProducts(
      payload.userId,
      payload.pager
    );

    return successResponder(response, products);
  } catch (error) {
    return errorResponder(response, error);
  }
}
