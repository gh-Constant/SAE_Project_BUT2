import type { Request, Response, NextFunction } from 'express'
import type { OAuthProvider } from '@prisma/client'
import { buildPublicUploadUrl } from './upload.controller.js'
import prisma from '../prisma.js'
import passport, { isOAuthProviderConfigured } from '../config/passport.config.js'
import {
  confirmOAuthLinkFromEmail,
  deleteOwnAccount,
  getUserById,
  getSecuritySettings,
  linkOAuthProvider,
  login,
  loginOrRegisterWithOAuth,
  register,
  unlinkOAuthProvider,
  upsertPassword,
} from '../services/authService.js'

interface AuthenticatedRequest extends Request {
  user: {
    id: number
    email: string
    role: string
  }
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:5173'
}

function getProviderFromRequest(req: Request): OAuthProvider {
  const provider = (req.params.provider || (req.path.includes('google') ? 'google' : req.path.includes('discord') ? 'discord' : undefined)) as OAuthProvider | undefined
  if (provider !== 'google' && provider !== 'discord') {
    throw new Error('Unsupported OAuth provider')
  }
  return provider
}

function extractOAuthProfile(input: any) {
  const profile = input?.profile
  const email = profile?.email || profile?.emails?.[0]?.value || null
  const avatarUrl = profile?.avatar
    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
    : profile?.photos?.[0]?.value || null
  const firstname = profile?.global_name || profile?.name?.givenName || profile?.username || profile?.displayName || 'Utilisateur'
  const lastname = profile?.name?.familyName || ''
  const providerUserId = profile?.id

  if (!providerUserId) {
    throw new Error('OAuth profile is missing provider id')
  }

  return {
    providerUserId,
    email,
    avatarUrl,
    firstname,
    lastname,
  }
}

async function redirectToOAuthResult(res: Response, params: Record<string, string>) {
  const url = new URL('/auth/oauth-success', getFrontendUrl())
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  res.redirect(url.toString())
}

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await login(email, password)
      res.json(result)
    } catch (error) {
      res.status(401).json({ error: (error as Error).message })
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role, prestataireTypeId } = req.body
      let { avatarUrl, avatarType } = req.body

      if (req.file) {
        avatarUrl = buildPublicUploadUrl(req, req.file.filename)
        avatarType = 'upload'
      }

      const user = await register(
        firstName,
        lastName,
        email,
        password,
        role,
        avatarUrl,
        avatarType,
        prestataireTypeId ? parseInt(prestataireTypeId.toString(), 10) : undefined
      )
      res.status(201).json(user)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const user = await getUserById(userId)

      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json(user)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  },

  async getMyRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const userWithRole = await prisma.user.findUnique({
        where: { id_user: userId },
        select: { role: true },
      })

      if (!userWithRole) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json({ role: userWithRole.role })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  },

  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const { firstname, lastname, email, prestataireTypeId, birthDate, phone, bio } = req.body
      let { avatarUrl, avatarType } = req.body

      if (req.file) {
        avatarUrl = buildPublicUploadUrl(req, req.file.filename)
        avatarType = 'upload'
      }

      const parsedPrestataireTypeId = prestataireTypeId ? parseInt(prestataireTypeId.toString(), 10) : undefined

      const existingUser = await prisma.user.findUnique({
        where: { id_user: userId },
        include: { prestataire: true },
      })

      if (!existingUser) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } })
        if (emailExists) {
          res.status(400).json({ error: 'Email already in use' })
          return
        }
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: 'Invalid email format' })
        return
      }

      if (birthDate) {
        const birthDateObj = new Date(birthDate)
        const today = new Date()
        const age = today.getFullYear() - birthDateObj.getFullYear()
        const monthDiff = today.getMonth() - birthDateObj.getMonth()
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate()) ? age - 1 : age

        if (isNaN(birthDateObj.getTime())) {
          res.status(400).json({ error: 'Invalid birth date format' })
          return
        }

        if (actualAge < 15) {
          res.status(400).json({ error: 'User must be at least 15 years old' })
          return
        }

        if (birthDateObj > today) {
          res.status(400).json({ error: 'Birth date cannot be in the future' })
          return
        }
      }

      if (bio !== undefined && bio !== null && bio.trim().length > 500) {
        res.status(400).json({ error: 'Bio must not exceed 500 characters' })
        return
      }

      const updateData: Record<string, string | number | Date | null> = {}
      if (firstname !== undefined) updateData.firstname = firstname
      if (lastname !== undefined) updateData.lastname = lastname
      if (email !== undefined) updateData.email = email
      if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null
      if (avatarType !== undefined) updateData.avatar_type = avatarType || null
      if (birthDate !== undefined) updateData.birth_date = birthDate ? new Date(birthDate) : null
      if (phone !== undefined) updateData.phone = phone || null
      if (bio !== undefined) updateData.bio = bio || null

      if (parsedPrestataireTypeId !== undefined && parsedPrestataireTypeId !== null) {
        const prestataireType = await prisma.prestataireType.findUnique({
          where: { id_prestataire_type: parsedPrestataireTypeId },
        })
        if (!prestataireType) {
          res.status(400).json({ error: 'Invalid prestataire type' })
          return
        }
      }

      if (updateData.firstname !== undefined && !(updateData.firstname as string).trim()) {
        res.status(400).json({ error: 'Firstname cannot be empty' })
        return
      }

      if (updateData.lastname !== undefined && !(updateData.lastname as string).trim()) {
        res.status(400).json({ error: 'Lastname cannot be empty' })
        return
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id_user: userId },
          data: updateData,
        })

        if (parsedPrestataireTypeId !== undefined) {
          await tx.prestataire.upsert({
            where: { id_user: userId },
            create: {
              id_user: userId,
              id_prestataire_type: parsedPrestataireTypeId,
            },
            update: {
              id_prestataire_type: parsedPrestataireTypeId,
            },
          })
        }
      })

      const updatedUser = await getUserById(userId)
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json(updatedUser)
    } catch (error) {
      const prismaError = error as { code?: string; message?: string }
      if (prismaError.code === 'P2002') {
        res.status(400).json({ error: 'Email already in use' })
        return
      }
      res.status(500).json({ error: prismaError.message || 'Failed to update profile' })
    }
  },

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const { currentPassword, newPassword } = req.body

      if (!newPassword) {
        res.status(400).json({ error: 'New password is required' })
        return
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters long' })
        return
      }

      const result = await upsertPassword(userId, newPassword, currentPassword)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async getSecurity(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const security = await getSecuritySettings(userId)
      res.json(security)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async requestPasswordSetup(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const user = await prisma.user.findUnique({
        where: { id_user: userId },
      })

      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      if (user.password_hashed) {
        res.status(400).json({ error: 'Ce compte possède déjà un mot de passe' })
        return
      }

      const crypto = await import('crypto')
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 3600000)

      await prisma.user.update({
        where: { id_user: user.id_user },
        data: {
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry,
        },
      })

      const { emailService } = await import('../services/emailService.js')
      await emailService.sendPasswordResetEmail(user.email, resetToken)

      res.json({ message: 'Un email de vérification a été envoyé pour définir votre mot de passe' })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to send password setup email' })
    }
  },

  async prepareOAuthLink(req: Request, res: Response): Promise<void> {
    try {
      const provider = getProviderFromRequest(req)
      const userId = (req as AuthenticatedRequest).user.id
      const session = (req as any).session
      session.oauthIntent = 'link'
      session.oauthLinkUserId = userId
      session.oauthProvider = provider
      res.json({ url: `/api/v1/auth/${provider}` })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async unlinkOAuth(req: Request, res: Response): Promise<void> {
    try {
      const provider = getProviderFromRequest(req)
      const userId = (req as AuthenticatedRequest).user.id
      const security = await unlinkOAuthProvider(userId, provider)
      res.json(security)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async confirmOAuthLink(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body
      if (!token) {
        res.status(400).json({ error: 'Token is required' })
        return
      }

      const result = await confirmOAuthLinkFromEmail(token)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  async deleteMyAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id
      const { currentPassword } = req.body || {}
      const result = await deleteOwnAccount(userId, currentPassword)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },

  startOAuth(req: Request, res: Response, next: NextFunction): void {
    try {
      const provider = getProviderFromRequest(req)
      if (!isOAuthProviderConfigured(provider)) {
        res.status(503).json({ error: `${provider} OAuth is not configured on the server` })
        return
      }
      const session = (req as any).session
      session.oauthIntent = session.oauthIntent || 'login'
      session.oauthProvider = provider
      passport.authenticate(provider, { session: false })(req, res, next)
    } catch (error) {
      next(error)
    }
  },

  handleOAuthCallback(req: Request, res: Response, next: NextFunction): void {
    try {
      const provider = getProviderFromRequest(req)
      if (!isOAuthProviderConfigured(provider)) {
        void redirectToOAuthResult(res, { error: `${provider}_oauth_not_configured` })
        return
      }
      passport.authenticate(provider, { session: false }, async (error: Error | null, payload: any) => {
        if (error || !payload) {
          await redirectToOAuthResult(res, {
            error: error?.message || 'oauth_callback_failed',
          })
          return
        }

        try {
          const profile = extractOAuthProfile(payload)
          const session = (req as any).session
          const intent = session?.oauthIntent
          const linkUserId = session?.oauthLinkUserId

          if (intent === 'link' && linkUserId) {
            await linkOAuthProvider(linkUserId, provider, profile)
            if (session) {
              session.oauthIntent = null
              session.oauthLinkUserId = null
              session.oauthProvider = null
            }
            const redirectUrl = new URL('/profile', getFrontendUrl())
            redirectUrl.searchParams.set('tab', 'security')
            redirectUrl.searchParams.set('oauth', 'linked')
            redirectUrl.searchParams.set('provider', provider)
            res.redirect(redirectUrl.toString())
            return
          }

          const result = await loginOrRegisterWithOAuth(provider, profile)
          if (session) {
            session.oauthIntent = null
            session.oauthLinkUserId = null
            session.oauthProvider = null
          }

          if ('requiresEmailVerification' in result && result.requiresEmailVerification) {
            const { emailService } = await import('../services/emailService.js')
            await emailService.sendOAuthLinkVerificationEmail(result.email, result.verificationToken, provider)
            await redirectToOAuthResult(res, {
              status: 'verification_email_sent',
              provider,
              email: result.email,
            })
            return
          }

          await redirectToOAuthResult(res, {
            token: result.token,
            provider,
          })
        } catch (callbackError) {
          await redirectToOAuthResult(res, {
            error: (callbackError as Error).message,
          })
        }
      })(req, res, next)
    } catch (error) {
      next(error)
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body

      if (!email) {
        res.status(400).json({ error: 'Email is required' })
        return
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        res.json({ message: 'If the email exists, a reset link has been sent' })
        return
      }

      const crypto = await import('crypto')
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 3600000)
      await prisma.user.update({
        where: { id_user: user.id_user },
        data: {
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry,
        },
      })

      const { emailService } = await import('../services/emailService.js')
      await emailService.sendPasswordResetEmail(email, resetToken)

      res.json({ message: 'If the email exists, a reset link has been sent' })
    } catch (error) {
      console.error('Forgot password error:', error)
      res.status(500).json({ error: 'Failed to process password reset request' })
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body

      if (!token || !newPassword) {
        res.status(400).json({ error: 'Token and new password are required' })
        return
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' })
        return
      }

      const user = await prisma.user.findUnique({ where: { reset_token: token } })

      if (!user || !user.reset_token_expiry) {
        res.status(400).json({ error: 'Invalid or expired reset token' })
        return
      }

      if (new Date() > user.reset_token_expiry) {
        res.status(400).json({ error: 'Reset token has expired' })
        return
      }

      const bcrypt = await import('bcrypt')
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { id_user: user.id_user },
        data: {
          password_hashed: hashedPassword,
          reset_token: null,
          reset_token_expiry: null,
        },
      })

      res.json({ message: 'Password has been reset successfully' })
    } catch (error) {
      console.error('Reset password error:', error)
      res.status(500).json({ error: 'Failed to reset password' })
    }
  },
}
