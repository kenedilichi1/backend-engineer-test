import { Request, Response, NextFunction } from "express";
import { ProductHttpInput, ProductInput } from "../dto/product.dto";
import { Exception } from "../../../utils/error";
import { VerifyJWT } from "../../../utils/verifyJwt";
import { JwtFor } from "../../../common/dtos";
import { ProductRepository } from "../repository/product.repository";
import { ProductService } from "../service/product.service";
import {
  errorResponder,
  successResponder,
} from "../../../utils/http-responder";

export function createProductMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { quantity, ...rest }: ProductHttpInput = request.body;
  const validateRequest = ProductHttpInput.safeParse({
    quantity: Number(quantity),
    ...rest,
  });
  const { userId, jwtFor } = VerifyJWT(request);

  if (jwtFor !== JwtFor.Enum.authorized) {
    throw new Exception(
      "AUTHENTICATION_ERROR",
      "Invalid token, please login again"
    );
  }
  if (!validateRequest.success) {
    throw new Exception(
      "VALIDATION_ERROR",
      validateRequest.error.issues[0].message,
      validateRequest.error.name
    );
  }

  const isPriceANum = !isNaN(Number(validateRequest.data.productPrice));

  if (!isPriceANum) {
    throw new Exception(
      "VALIDATION_ERROR",
      "product price must be a valid number"
    );
  }

  request.body = {
    ...validateRequest.data,
    userId,
  };

  return next();
}

export async function createProductController(
  request: Request,
  response: Response
) {
  try {
    /**
		 * #swagger.start
		 * #swagger.path = '/v1/product'
		 * #swagger.auto = false
		 * #swagger.method = 'POST'
		 * #swagger.tags = ['Product']
		 * #swagger.summary = 'Create new product'
		 * #swagger.description = 'Create new product '
		 * #swagger.operationId = 'create-product'
		 * #swagger.produces = ['application/json']
		 * #swagger.security = [{"token": []}]

		 * #swagger.consumes = ['multipart/form-data']
		 * #swagger.parameters['images'] = {
						in: 'formData',
						type: 'file',
						required: 'true',
						description: 'product images ',
				}

		 * #swagger.parameters['body'] = { in: 'body', description: 'Product credentials', schema: { $ref: '#/definitions/productHttpInput'}}

		 * #swagger.responses[200] = {
			description: 'created product successfully',
			schema: {
				$ref: '#/definitions/createProductHttpRes'
			}
		}
		 * #swagger.responses[500] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[404] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 *
		 * #swagger.responses[400] = { description: 'Server Error', schema: { $ref: '#/definitions/httpErrorResponse' }}
		 */

    const payload: ProductInput = request.body;
    const files = request.files as Express.Multer.File[];

    const mongoDbInstance = request.app.locals.mongoDbInstance;

    const productRepo = new ProductRepository(mongoDbInstance);
    const productService = new ProductService(productRepo);

    const productImages = files.map((file) => file.path);

    const addProduct = await productService.createProduct({
      ...payload,
      productImages,
    });

    return successResponder(
      response,
      { productId: addProduct },
      "product successfully created"
    );
  } catch (error) {
    return errorResponder(response, error);
  }
}
