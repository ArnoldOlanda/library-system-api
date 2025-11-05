import { ValidRole } from "../enums/validRoles.enum";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}