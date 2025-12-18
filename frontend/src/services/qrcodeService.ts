import { qrSessionsMock, generateMockToken, type QRSessionMock, type QRCodeStatus } from '@/mocks/qrcode'

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export interface QRSession {
    id: string
    token: string
    status: QRCodeStatus
    data?: Record<string, any>
    createdAt: string
    scannedAt?: string
    createdBy?: { id_user: number; firstname: string; lastname: string }
    scannedBy?: { id_user: number; firstname: string; lastname: string }
}

export interface GenerateQRInput {
    data?: Record<string, any>
    userId?: number
}

export interface ValidateQRInput {
    token: string
    scannedById?: number
}

export interface ValidateQRResult {
    success: boolean
    error?: string
    session?: QRSession
    data?: Record<string, any>
}

// ==================== MOCK SERVICE ====================

const qrcodeMockService = {
    /**
     * Generate a new QR code session (mock)
     */
    async generate(input: GenerateQRInput): Promise<QRSession> {
        await new Promise(resolve => setTimeout(resolve, 200)) // Simulate network delay

        const newSession: QRSessionMock = {
            id: 'mock-id-' + Date.now(),
            token: generateMockToken(),
            status: 'PENDING',
            data: input.data,
            createdById: input.userId,
            createdAt: new Date().toISOString(),
        }

        qrSessionsMock.push(newSession)

        return {
            id: newSession.id,
            token: newSession.token,
            status: newSession.status,
            data: newSession.data,
            createdAt: newSession.createdAt,
        }
    },

    /**
     * Validate a scanned QR code (mock)
     */
    async validate(input: ValidateQRInput): Promise<ValidateQRResult> {
        await new Promise(resolve => setTimeout(resolve, 200))

        const session = qrSessionsMock.find(s => s.token === input.token)

        if (!session) {
            return { success: false, error: 'QR code not found' }
        }

        if (session.status === 'USED') {
            return { success: false, error: 'QR code already used' }
        }

        // Update session status
        session.status = 'SCANNED'
        session.scannedById = input.scannedById
        session.scannedAt = new Date().toISOString()

        return {
            success: true,
            session: {
                id: session.id,
                token: session.token,
                status: session.status,
                data: session.data,
                createdAt: session.createdAt,
                scannedAt: session.scannedAt,
            },
            data: session.data,
        }
    },

    /**
     * Get QR session status (mock)
     */
    async getStatus(id: string): Promise<QRSession | null> {
        await new Promise(resolve => setTimeout(resolve, 100))

        const session = qrSessionsMock.find(s => s.id === id)
        if (!session) return null

        return {
            id: session.id,
            token: session.token,
            status: session.status,
            data: session.data,
            createdAt: session.createdAt,
            scannedAt: session.scannedAt,
        }
    },

    /**
     * Mark QR session as used (mock)
     */
    async markAsUsed(id: string): Promise<QRSession | null> {
        await new Promise(resolve => setTimeout(resolve, 100))

        const session = qrSessionsMock.find(s => s.id === id)
        if (!session) return null

        session.status = 'USED'

        return {
            id: session.id,
            token: session.token,
            status: session.status,
            data: session.data,
            createdAt: session.createdAt,
            scannedAt: session.scannedAt,
        }
    },
}

// ==================== API SERVICE ====================

const qrcodeApiService = {
    async generate(input: GenerateQRInput): Promise<QRSession> {
        const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            throw new Error('Failed to generate QR code')
        }

        return response.json()
    },

    async validate(input: ValidateQRInput): Promise<ValidateQRResult> {
        const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            const error = await response.json()
            return { success: false, error: error.error || 'Validation failed' }
        }

        return response.json()
    },

    async getStatus(id: string): Promise<QRSession | null> {
        const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/status/${id}`)

        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error('Failed to fetch QR status')
        }

        return response.json()
    },

    async markAsUsed(id: string): Promise<QRSession | null> {
        const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/${id}/use`, {
            method: 'POST',
        })

        if (!response.ok) {
            throw new Error('Failed to mark QR as used')
        }

        return response.json()
    },
}

// ==================== EXPORT ====================

export const qrcodeService = isMockEnabled ? qrcodeMockService : qrcodeApiService
