import { Db } from "mongodb";
import { BaseRepository } from "../../../common/database/base-repositroy";
import { UserEntity } from "../entity/user.entity";
import { CollectionNames } from "../../../common/database/colletction-names";

export class UserRepository extends BaseRepository<UserEntity> {
  constructor(mongoDbInstance: Db) {
    super(mongoDbInstance, CollectionNames.User);
  }
}
