import { User } from "../entities/User";

export const validateRegister = async (
  username: string,
  email: string,
  password: string
) => {
  if (username.length < 2)
    return [
      {
        field: "username",
        message: "invalid username",
      },
    ];
  else if (password.length < 2)
    return [
      {
        field: "password",
        message: "invalid password",
      },
    ];
  else if (await User.findOne({ where: { email } }))
    return [
      {
        field: "email",
        message: "email already exists",
      },
    ];
  else if (await User.findOne({ where: { username } }))
    return [
      {
        field: "username",
        message: "username already exists",
      },
    ];
  return null;
};
