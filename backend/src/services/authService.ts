import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { AvatarType, OAuthProvider, Prisma, Role } from '@prisma/client'
import prisma from '../prisma.js'

type JwtPayload = {
  id: number
  email: string
  role: string
}

type OAuthEmailLinkTokenPayload = {
  action: 'oauth-link'
  userId: number
  provider: OAuthProvider
  providerUserId: string
  email: string
  firstname?: string | null
  lastname?: string | null
  avatarUrl?: string | null
}

const publicUserSelect = {
  id_user: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  avatar_url: true,
  avatar_type: true,
  birth_date: true,
  phone: true,
  bio: true,
  gold: true,
  is_verified: true,
  password_hashed: true,
  profile: {
    select: {
      xp: true,
      level: true,
    },
  },
  prestataire: {
    select: {
      id_prestataire_type: true,
    },
  },
  oauthAccounts: {
    select: {
      provider: true,
    },
  },
} satisfies Prisma.UserSelect

type PublicUserRecord = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>

type OAuthProfileInput = {
  providerUserId: string
  email?: string | null
  firstname?: string | null
  lastname?: string | null
  avatarUrl?: string | null
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_secret_key_change_in_prod'
}

function signToken(user: { id_user: number; email: string; role: string }) {
  return jwt.sign(
    { id: user.id_user, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '1h' }
  )
}

function signOAuthEmailLinkToken(payload: OAuthEmailLinkTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' })
}

function verifyOAuthEmailLinkToken(token: string) {
  const decoded = jwt.verify(token, getJwtSecret()) as OAuthEmailLinkTokenPayload
  if (decoded.action !== 'oauth-link') {
    throw new Error('Invalid OAuth link token')
  }
  return decoded
}

export function serializePublicUser(user: PublicUserRecord) {
  return {
    ...user,
    password_hashed: undefined,
    xp: user.profile?.xp ?? null,
    level: user.profile?.level ?? null,
    id_prestataire_type: user.prestataire?.id_prestataire_type ?? null,
    hasPassword: Boolean(user.password_hashed),
    oauthProviders: user.oauthAccounts.map((account) => account.provider),
  }
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
    select: publicUserSelect,
  })

  return user ? serializePublicUser(user) : null
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  if (!user.password_hashed) {
    throw new Error('Ce compte utilise uniquement une connexion externe pour le moment')
  }

  const validPassword = await bcrypt.compare(password, user.password_hashed)
  if (!validPassword) {
    throw new Error('Mot de passe invalide')
  }

  const publicUser = await getUserById(user.id_user)
  if (!publicUser) {
    throw new Error('Utilisateur non trouvé')
  }

  const token = signToken(user)
  return { user: publicUser, token }
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: Role,
  avatarUrl?: string,
  avatarType?: AvatarType,
  prestataireTypeId?: number,
) {
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    throw new Error('Utilisateur déjà existant')
  }

  if (!role) {
    throw new Error('Rôle invalide')
  }

  const prestataireType = role === 'prestataire' ? (prestataireTypeId ?? 1) : undefined
  if (role === 'prestataire' && prestataireType) {
    const validType = await prisma.prestataireType.findUnique({
      where: { id_prestataire_type: prestataireType },
    })
    if (!validType) {
      throw new Error('Type de prestataire invalide')
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        email,
        password_hashed: hashedPassword,
        role,
        is_verified: false,
        avatar_url: avatarUrl || 'default',
        avatar_type: avatarType || 'gallery',
        profile: role === 'aventurier'
          ? {
              create: {
                level: 0,
                xp: 0,
              },
            }
          : undefined,
      },
    })

    if (role === 'prestataire' && prestataireType) {
      await tx.prestataire.create({
        data: {
          id_user: user.id_user,
          id_prestataire_type: prestataireType,
        },
      })
    }

    return user
  })

  const publicUser = await getUserById(createdUser.id_user)
  if (!publicUser) {
    throw new Error('Utilisateur non trouvé')
  }

  return publicUser
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload
    const user = await getUserById(decoded.id)

    if (!user) {
      throw new Error('User not found')
    }

    return { user, token }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw error
  }
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload
    return await getUserById(decoded.id)
  } catch {
    return null
  }
}

export async function upsertPassword(userId: number, newPassword: string, currentPassword?: string) {
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  if (user.password_hashed) {
    if (!currentPassword) {
      throw new Error('Mot de passe actuel requis')
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password_hashed)
    if (!validPassword) {
      throw new Error('Mot de passe actuel incorrect')
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id_user: userId },
    data: { password_hashed: hashedPassword },
  })

  return {
    message: user.password_hashed
      ? 'Mot de passe mis à jour avec succès'
      : 'Mot de passe ajouté avec succès',
  }
}

export async function getSecuritySettings(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
    select: {
      email: true,
      password_hashed: true,
      oauthAccounts: {
        select: {
          provider: true,
          provider_email: true,
          created_at: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  return {
    email: user.email,
    hasPassword: Boolean(user.password_hashed),
    linkedProviders: user.oauthAccounts.map((account) => ({
      provider: account.provider,
      email: account.provider_email,
      linkedAt: account.created_at,
    })),
  }
}

export async function loginOrRegisterWithOAuth(
  provider: OAuthProvider,
  profile: OAuthProfileInput
) {
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_provider_user_id: {
        provider,
        provider_user_id: profile.providerUserId,
      },
    },
    include: {
      user: true,
    },
  })

  if (existingAccount) {
    const publicUser = await getUserById(existingAccount.user.id_user)
    if (!publicUser) {
      throw new Error('Utilisateur non trouvé')
    }

    return {
      user: publicUser,
      token: signToken(existingAccount.user),
    }
  }

  if (!profile.email) {
    throw new Error('Ce compte OAuth ne fournit pas d’adresse email')
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: profile.email },
  })

  if (existingUserByEmail) {
    return {
      requiresEmailVerification: true as const,
      verificationToken: signOAuthEmailLinkToken({
        action: 'oauth-link',
        userId: existingUserByEmail.id_user,
        provider,
        providerUserId: profile.providerUserId,
        email: profile.email,
        firstname: profile.firstname,
        lastname: profile.lastname,
        avatarUrl: profile.avatarUrl,
      }),
      email: profile.email,
      provider,
    }
  }

  const user = await prisma.$transaction(async (tx) => {
    const targetUser = await tx.user.create({
      data: {
        firstname: profile.firstname?.trim() || 'Utilisateur',
        lastname: profile.lastname?.trim() || 'OAuth',
        email: profile.email!,
        password_hashed: null,
        role: 'aventurier',
        is_verified: true,
        avatar_url: profile.avatarUrl || 'default',
        avatar_type: 'upload',
        profile: {
          create: {
            level: 0,
            xp: 0,
          },
        },
      },
    })

    await tx.oAuthAccount.create({
      data: {
        provider,
        provider_user_id: profile.providerUserId,
        provider_email: profile.email || null,
        id_user: targetUser.id_user,
      },
    })

    return targetUser
  })

  const publicUser = await getUserById(user.id_user)
  if (!publicUser) {
    throw new Error('Utilisateur non trouvé')
  }

  return {
    user: publicUser,
    token: signToken(user),
  }
}

export async function confirmOAuthLinkFromEmail(token: string) {
  const payload = verifyOAuthEmailLinkToken(token)

  const targetUser = await prisma.user.findUnique({
    where: { id_user: payload.userId },
  })

  if (!targetUser) {
    throw new Error('Utilisateur non trouvé')
  }

  if (targetUser.email !== payload.email) {
    throw new Error('L’adresse email de ce compte a changé depuis la demande de liaison')
  }

  const existingForProvider = await prisma.oAuthAccount.findUnique({
    where: {
      provider_provider_user_id: {
        provider: payload.provider,
        provider_user_id: payload.providerUserId,
      },
    },
  })

  if (existingForProvider && existingForProvider.id_user !== targetUser.id_user) {
    throw new Error('Ce compte externe est déjà lié à un autre utilisateur')
  }

  await prisma.oAuthAccount.upsert({
    where: {
      id_user_provider: {
        id_user: targetUser.id_user,
        provider: payload.provider,
      },
    },
    update: {
      provider_user_id: payload.providerUserId,
      provider_email: payload.email,
    },
    create: {
      id_user: targetUser.id_user,
      provider: payload.provider,
      provider_user_id: payload.providerUserId,
      provider_email: payload.email,
    },
  })

  const publicUser = await getUserById(targetUser.id_user)
  if (!publicUser) {
    throw new Error('Utilisateur non trouvé')
  }

  return {
    user: publicUser,
    token: signToken(targetUser),
    provider: payload.provider,
  }
}

export async function linkOAuthProvider(userId: number, provider: OAuthProvider, profile: OAuthProfileInput) {
  const existingForProvider = await prisma.oAuthAccount.findUnique({
    where: {
      provider_provider_user_id: {
        provider,
        provider_user_id: profile.providerUserId,
      },
    },
  })

  if (existingForProvider && existingForProvider.id_user !== userId) {
    throw new Error('Ce compte externe est déjà lié à un autre utilisateur')
  }

  await prisma.oAuthAccount.upsert({
    where: {
      id_user_provider: {
        id_user: userId,
        provider,
      },
    },
    update: {
      provider_user_id: profile.providerUserId,
      provider_email: profile.email || null,
    },
    create: {
      id_user: userId,
      provider,
      provider_user_id: profile.providerUserId,
      provider_email: profile.email || null,
    },
  })

  return await getSecuritySettings(userId)
}

export async function unlinkOAuthProvider(userId: number, provider: OAuthProvider) {
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
    select: {
      password_hashed: true,
      oauthAccounts: {
        select: {
          provider: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  const isLinked = user.oauthAccounts.some((account) => account.provider === provider)
  if (!isLinked) {
    throw new Error('Compte externe non lié')
  }

  if (!user.password_hashed && user.oauthAccounts.length <= 1) {
    throw new Error('Ajoutez un mot de passe ou un autre fournisseur avant de retirer cette connexion')
  }

  await prisma.oAuthAccount.delete({
    where: {
      id_user_provider: {
        id_user: userId,
        provider,
      },
    },
  })

  return await getSecuritySettings(userId)
}

export async function deleteOwnAccount(userId: number, currentPassword?: string) {
  const user = await prisma.user.findUnique({
    where: { id_user: userId },
    select: {
      id_user: true,
      password_hashed: true,
    },
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  if (user.password_hashed) {
    if (!currentPassword) {
      throw new Error('Mot de passe requis pour supprimer ce compte')
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password_hashed)
    if (!validPassword) {
      throw new Error('Mot de passe actuel incorrect')
    }
  }

  await prisma.user.delete({
    where: { id_user: userId },
  })

  return { message: 'Compte supprimé avec succès' }
}
