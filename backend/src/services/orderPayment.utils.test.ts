import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { toGoldAmount } from './orderPayment.utils.js';

describe('toGoldAmount', () => {
    it('returns integer gold amounts unchanged', () => {
        expect(toGoldAmount(2550)).toBe(2550);
    });

    it('accepts Prisma decimals that represent exact integer gold amounts', () => {
        expect(toGoldAmount(new Prisma.Decimal('1890.00'))).toBe(1890);
    });

    it('rejects fractional gold amounts', () => {
        expect(() => toGoldAmount(new Prisma.Decimal('12.50'))).toThrow('Invalid gold amount');
    });
});
