import type { H3Event, SessionConfig } from 'h3'
import type { SessionUser } from '../../types/auth'

const SESSION_COOKIE_NAME = 'auth-session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

interface AuthSessionData {
  user?: SessionUser
}

function getSessionConfig(event: H3Event): SessionConfig {
  const { sessionSecret } = useRuntimeConfig(event)
  const secure = getRequestProtocol(event) === 'https'

  return {
    name: SESSION_COOKIE_NAME,
    password: sessionSecret,
    maxAge: SESSION_MAX_AGE_SECONDS,
    cookie: {
      httpOnly: true,
      path: '/',
      secure,
      // Over https the cookie is sent as SameSite=None so it still works when the
      // app runs inside a cross-site iframe (the StackBlitz preview).
      sameSite: secure ? 'none' : 'lax'
    }
  }
}

export function useAuthSession(event: H3Event) {
  return useSession<AuthSessionData>(event, getSessionConfig(event))
}

export async function getAuthUser(event: H3Event): Promise<SessionUser | null> {
  if (!getCookie(event, SESSION_COOKIE_NAME)) {
    return null
  }

  const session = await useAuthSession(event)
  return session.data.user ?? null
}
