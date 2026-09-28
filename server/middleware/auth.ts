const LOGIN_PATH = '/login'
const HOME_PATH = '/home'
const ADMIN_PATH = '/admin'

function normalizePath(pathname: string): string {
  let path = pathname

  try {
    path = decodeURIComponent(pathname)
  } catch {
    // Malformed encoding: keep the raw path.
  }

  // The client router is case-insensitive and ignores trailing/duplicate slashes,
  // so the check has to normalize the same way to avoid being bypassed.
  return path.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/'
}

function matches(path: string, base: string): boolean {
  return path === base || path.startsWith(`${base}/`)
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return
  }

  const path = normalizePath(getRequestURL(event).pathname)
  const isLogin = path === LOGIN_PATH
  const isAdmin = matches(path, ADMIN_PATH)
  const isProtected = isAdmin || matches(path, HOME_PATH)

  if (!isLogin && !isProtected) {
    return
  }

  const user = await getAuthUser(event)

  if (isLogin) {
    return user ? sendRedirect(event, HOME_PATH, 302) : undefined
  }

  if (!user) {
    return sendRedirect(event, LOGIN_PATH, 302)
  }

  if (isAdmin && user.role !== 'admin') {
    return sendRedirect(event, HOME_PATH, 302)
  }
})
