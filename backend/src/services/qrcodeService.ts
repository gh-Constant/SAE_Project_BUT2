import prisma from '../prisma.js';
import { randomUUID } from 'crypto';

export interface CreateQRSessionData {
    data?: Record<string, any>;
    createdById?: number;
}

export interface ValidateQRData {
    token: string;
    scannedById?: number;
}

const qrcodeService = {
    /**
     * Generate a new QR session with a unique token
     */
    async generate(input: CreateQRSessionData) {
        const token = randomUUID();

        const session = await prisma.qRSession.create({
            data: {
                token,
                data: input.data ?? undefined,
                created_by_id: input.createdById ?? undefined,
            },
        });

        return session;
    },

    /**
     * Validate a scanned QR code token
     */
    async validate(input: ValidateQRData) {
        const session = await prisma.qRSession.findUnique({
            where: { token: input.token },
        });

        if (!session) {
            return { success: false, error: 'QR code not found' };
        }

        if (session.status === 'USED') {
            return { success: false, error: 'QR code already used' };
        }

        // Update session status to SCANNED
        const updated = await prisma.qRSession.update({
            where: { id: session.id },
            data: {
                status: 'SCANNED',
                scanned_by_id: input.scannedById ?? undefined,
                scanned_at: new Date(),
            },
        });

        return {
            success: true,
            session: updated,
            data: updated.data
        };
    },

    /**
     * Get the status of a QR session
     */
    async getStatus(id: string) {
        const session = await prisma.qRSession.findUnique({
            where: { id },
            include: {
                created_by: {
                    select: { id_user: true, firstname: true, lastname: true }
                },
                scanned_by: {
                    select: { id_user: true, firstname: true, lastname: true }
                }
            }
        });

        return session;
    },

    /**
     * Mark a QR session as used (after processing)
     */
    async markAsUsed(id: string) {
        return prisma.qRSession.update({
            where: { id },
            data: { status: 'USED' },
        });
    },

    /**
     * Get QR session by token
     */
    async getByToken(token: string) {
        return prisma.qRSession.findUnique({
            where: { token },
        });
    }
};

export default qrcodeService;
