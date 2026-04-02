declare global {
  namespace Express {
    interface User {
      id: number
      email: string
      role: string
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    oauthIntent?: 'login' | 'link' | null
    oauthLinkUserId?: number | null
    oauthProvider?: 'google' | 'discord' | null
  }
}

export {}
