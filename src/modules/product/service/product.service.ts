import { ObjectId } from "mongodb";
import { ProductDto } from "../dto/product.dto";
import { ProductRepository } from "../repository/product.repository";
import { EntityStatusOptions } from "../../../common/dtos";

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
}
