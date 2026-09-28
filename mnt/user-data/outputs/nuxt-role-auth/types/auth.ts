export type Role = 'admin' | 'employee'

export interface SessionUser {
  username: string
  role: Role
}
