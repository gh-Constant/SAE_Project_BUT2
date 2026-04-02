import passport from 'passport'
import { Strategy as GoogleStrategy, type Profile as GoogleProfile } from 'passport-google-oauth20'
import { Strategy as DiscordStrategy } from 'passport-discord'
import type { OAuthProvider } from '@prisma/client'

export type OAuthDonePayload = {
  provider: OAuthProvider
  profile: GoogleProfile | any
}

const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || '3000'}`

export function isOAuthProviderConfigured(provider: OAuthProvider) {
  if (provider === 'google') {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  }

  return Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET)
}

if (isOAuthProviderConfigured('google')) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${backendUrl}/api/v1/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    (_accessToken, _refreshToken, profile, done) => {
      done(null, { provider: 'google', profile } as any)
    }
  ))
}

if (isOAuthProviderConfigured('discord')) {
  passport.use(new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_CALLBACK_URL || `${backendUrl}/api/v1/auth/discord/callback`,
      scope: ['identify', 'email'],
    },
    (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
      done(null, { provider: 'discord', profile } as any)
    }
  ))
}

export default passport
