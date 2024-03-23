import { ObjectId } from "mongodb";
import { EntityStatusOptions } from "../../../common/dtos";
import { User } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";
import { UserEntity } from "../entity/user.entity";
import { Exception } from "../../../utils/error";

export interface UserService {
  addNewUser(user: User): Promise<string>;
  findOneUser(userId: string): Promise<UserEntity>;
  doesEmailExist(email: string): Promise<boolean>;
  findOneUserWithEmail(email: string): Promise<UserEntity>;
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  private userDtoToEntity(user: User) {
    return {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
      entityStatus: {
        at: new Date(),
        status: EntityStatusOptions.Enum.ACTIVE,
      },
      _id: new ObjectId(),
    };
  }

  async addNewUser(user: User): Promise<string> {
    const userEntity = this.userDtoToEntity(user);
    const newUser = await this.userRepo.add(userEntity);
    return newUser.toString();
  }

  async findOneUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.fetchOne(
      { _id: new ObjectId(userId) },
      ["password"],
      []
    );

    if (!user) {
      throw new Exception("NOT_FOUND");
    }

    return user;
  }

  async findOneUserWithEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepo.fetchOne({ email }, [], []);

    if (!user) {
      throw new Exception("NOT_FOUND", "user does not exist, please signup");
    }

    return user;
  }

  async doesEmailExist(email: string): Promise<boolean> {
    const user = await this.userRepo.fetchOne({ email }, ["password"], []);

    if (user) {
      return true;
    }

    return false;
  }
}
