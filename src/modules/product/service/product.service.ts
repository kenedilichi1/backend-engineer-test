import { ObjectId } from "mongodb";
import { Product, ProductDto } from "../dto/product.dto";
import { ProductRepository } from "../repository/product.repository";
import { EntityStatusOptions } from "../../../common/dtos";
import {
  IPagerFirst,
  IPagerNext,
  IPagerPrevious,
  PagerAction,
  PaginationCursor,
} from "../../../common/interface/pagination";
import { ProductEntity } from "../entity/product.entity";
import { Exception } from "../../../utils/error";
import { paginationHelper, toObjectId } from "../../../utils/helper-functions";

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  private dtoToEntity(productData: ProductDto) {
    const { userId, ...rest } = productData;
    const productEntity = {
      userId: new ObjectId(userId),
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date(),
      entityStatus: {
        at: new Date(),
        by: userId,
        status: EntityStatusOptions.Enum.ACTIVE,
      },
      _id: new ObjectId(),
    };

    return productEntity;
  }

  async createProduct(productData: ProductDto): Promise<string> {
    const productEntity = this.dtoToEntity(productData);

    const newProduct = await this.productRepo.add(productEntity);

    return newProduct.toString();
  }

  async fetchProducts(
    userId: string,
    paginationData: IPagerFirst | IPagerNext | IPagerPrevious
  ) {
    const limit = paginationData.limit;
    const _query: Record<string, any> = { userId: toObjectId(userId) };

    const { sort, query } = await paginationHelper(paginationData, _query);

    const products = await this.productRepo.fetch(
      query,
      ["entityStatus"],
      [],
      limit + 1,
      sort
    );

    const previousAction = paginationData.action === PagerAction.Previous;

    if (products.length < 1) {
      throw new Exception("NOT_FOUND", "No product found, add new products");
    }

    if (previousAction) {
      products.reverse();
    }

    const results: Product[] = products.map((product: ProductEntity) => {
      const { _id, userId, ...rest } = product;
      return {
        productId: _id.toString(),
        userId: userId.toString(),
        ...rest,
      };
    });

    const resultSize = results.length;

    const _after =
      resultSize <= paginationData.limit
        ? results[resultSize - 1].productId
        : !previousAction
        ? results[paginationData.limit - 1].productId
        : results[resultSize - 1].productId;

    const cursor: PaginationCursor = {
      after: _after,
      before: !previousAction ? results[0].productId : results[1].productId,
      hasNext: !previousAction ? results.length > limit : true,
      hasPrevious: !previousAction
        ? paginationData.action === PagerAction.Next
        : resultSize > limit,
    };

    if (previousAction) {
      results.shift();
    }
    if (results.length > limit) {
      results.pop();
    }
    return {
      products: results,
      paginationCursor: cursor,
    };
  }
}
