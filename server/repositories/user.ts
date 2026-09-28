import type { SessionUser } from '../../types/auth'

interface UserRecord extends SessionUser {
  password: string
}

const users: UserRecord[] = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'employee', password: 'employee', role: 'employee' }
]

export async function findUser(username: string, password: string): Promise<SessionUser | null> {
  const record = users.find(
    (user) => user.username === username && user.password === password
  )

  if (!record) {
    return null
  }

  return { username: record.username, role: record.role }
}
