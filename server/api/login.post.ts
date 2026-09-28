import { z } from 'zod'
import { findUser } from '../repositories/user'

const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(4, { message: 'Invalid username' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters' })
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    const issues = parsed.error.issues.map(({ path, message }) => ({
      field: path.join('.'),
      message
    }))

    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: issues.map((issue) => issue.message).join('. '),
      data: { issues }
    })
  }

  const user = await findUser(parsed.data.username, parsed.data.password)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid username or password'
    })
  }

  const session = await useAuthSession(event)
  await session.update({ user })

  return { user }
})
