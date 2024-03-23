import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { User } from "../../user/dto/user.dto";
import { UserService } from "../../user/service/user.service";
import { Exception } from "../../../utils/error";
import { JWT_SECRET } from "../../../common/config";
import { AuthDto, LoginDto } from "../dto/auth.dto";
import { JwtFor } from "../../../common/dtos";

export class AuthService {
  constructor(private readonly userService: UserService) {}

  private async hashPassword(password: string): Promise<string> {
    const hash = argon2.hash(password);
    return hash;
  }

  private async verifyPassword(
    incomingPassword: string,
    passwordFromDb: string
  ): Promise<boolean> {
    const isPasswordValid = await argon2.verify(
      passwordFromDb,
      incomingPassword
    );
    return isPasswordValid;
  }

  async signup(user: User): Promise<AuthDto> {
    const { password, email, ...rest } = user;
    const hashedPassword = await this.hashPassword(password);

    const doesUserExist = await this.userService.doesEmailExist(email);

    if (doesUserExist) {
      throw new Exception(
        "AUTHENTICATION_ERROR",
        "this user already exists, please login"
      );
    }

    const addNewUser = await this.userService.addNewUser({
      password: hashedPassword,
      email,
      ...rest,
    });

    const token = jwt.sign(
      { userId: addNewUser, jwtFor: JwtFor.Enum.authorized },
      JWT_SECRET as string,
      {
        algorithm: "HS256",
        expiresIn: "24h",
      }
    );

    return { token, userId: addNewUser };
  }

  async login(loginData: LoginDto): Promise<AuthDto> {
    const { password, email } = loginData;
    const user = await this.userService.findOneUserWithEmail(email);

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Exception("AUTHENTICATION_ERROR", "invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id.toString(), jwtFor: JwtFor.Enum.authorized },
      JWT_SECRET as string,
      {
        algorithm: "HS256",
        expiresIn: "24h",
      }
    );

    return { token, userId: user._id.toString() };
  }
}
