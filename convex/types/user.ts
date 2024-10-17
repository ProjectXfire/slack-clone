import { Id } from "../_generated/dataModel";

export interface User {
  _id: Id<"users">;
  name: string;
  image?: string;
  email: string;
}
