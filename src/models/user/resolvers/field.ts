import { Resolver } from "type-graphql";
import { User } from "../entities/User";

@Resolver(User)
export class UserFieldResolver {}
