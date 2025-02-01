import type { Role } from "../../roles/interfaces/role.interface";
export interface UserFromClient {
  _id: string
  name: string
  surname: string
  email: string
  password: string
  roles: Role[]
}
