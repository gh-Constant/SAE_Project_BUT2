import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from "../prisma.js";

//TODO: Add JWT token when the player register also

const roleMap: { [key: string]: number } = {
  'adventurer': 1,
  'artisan': 2,
};

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) throw new Error("Utilisateur non trouvé");
  const validPassword = await bcrypt.compare(password, user.passwordHashed);
  if (!validPassword) throw new Error("Mot de passe invalide");
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { user, token };
}

export async function register(firstName: string, lastName: string, email: string, password: string, role: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Utilisateur déjà existant");
  const roleId = roleMap[role];
  if (!roleId) throw new Error("Rôle invalide");
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      firstname: firstName,
      lastname: lastName,
      email,
      passwordHashed: hashedPassword,
      roleId
    }
  });
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { user, token };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    return await prisma.user.findUnique({
      where: { id: decoded.id }
    });
  } catch (error) {
    return null;
  }
}
