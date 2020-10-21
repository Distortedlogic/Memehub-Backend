import { compare } from "bcryptjs";
import { FieldError } from "../../../utils/types";
import { User } from "../User.entity";

export const validateLogin = async (
  user: User | undefined,
  password: string
): Promise<FieldError[] | undefined> => {
  if (!user)
    return [
      {
        field: "usernameOrEmail",
        message: "username or email does not exist",
      },
    ];
  else if (!(await compare(password, user.password)))
    return [
      {
        field: "password",
        message: "incorrect password",
      },
    ];
  return;
};
