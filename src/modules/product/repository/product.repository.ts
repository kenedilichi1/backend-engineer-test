import { Db } from "mongodb";
import { BaseRepository } from "../../../common/database/base-repositroy";
import { ProductEntity } from "../entity/product.entity";
import { CollectionNames } from "../../../common/database/colletction-names";

export class ProductRepository extends BaseRepository<ProductEntity> {
  constructor(mongoDbInstance: Db) {
    super(mongoDbInstance, CollectionNames.Product);
  }
}
