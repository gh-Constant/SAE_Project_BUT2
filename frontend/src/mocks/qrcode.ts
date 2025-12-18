export type QRCodeStatus = 'PENDING' | 'SCANNED' | 'USED'

export interface QRSessionMock {
    id: string
    token: string
    status: QRCodeStatus
    data?: Record<string, any>
    createdById?: number
    scannedById?: number
    createdAt: string
    scannedAt?: string
}

// In-memory storage for mock QR sessions
export const qrSessionsMock: QRSessionMock[] = []

/**
 * Generate a unique mock token
 */
export function generateMockToken(): string {
    return 'mock-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
