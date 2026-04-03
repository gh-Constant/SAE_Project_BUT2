import { Prisma } from '@prisma/client';

export const toGoldAmount = (value: Prisma.Decimal | number) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
        throw new Error('Invalid gold amount');
    }

    const roundedValue = Math.round(numericValue);
    if (Math.abs(roundedValue - numericValue) > Number.EPSILON) {
        throw new Error('Invalid gold amount');
    }

    return roundedValue;
};
