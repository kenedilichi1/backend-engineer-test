import { UserRepository } from "../repository/user.repository";
import { UserService } from "../service/user.service";
import { ObjectId } from "mongodb";

jest.mock("../repository/user.repository.ts", () => ({
  add: jest.fn(),
  fetchOne: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

afterAll(async () => {
  jest.clearAllMocks();
});

describe("user service ", () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeAll(() => {
    userRepo = new (<new () => UserRepository>(
      UserRepository
    ))() as jest.Mocked<UserRepository>;

    service = new UserService(userRepo);
  });

  const mockNewUser = {
    email: "hello@gmail.com",
    password: "12345678",
    name: "hello",
  };

  it("create a new user", async () => {
    const id = new ObjectId();
    userRepo.add.mockResolvedValueOnce(id);

    // WHEN
    const user = service.addNewUser(mockNewUser);

    // THEN
    expect(userRepo.add).toHaveBeenCalledTimes(1);
    expect(user).toBeDefined();
    expect((await user).toString()).toEqual(id.toString());
  });
});
