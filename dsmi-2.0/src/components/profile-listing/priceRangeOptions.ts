import type { NumericFilters } from '@algolia/client-search';

export interface PriceRange {
    min: number;
    max: number | null;
}

export interface PriceRangeOption {
    id: string;
    label: string;
    range: PriceRange;
}

export type PriceRangeSelection = string[];

export const DEFAULT_PRICE_RANGE_SELECTION: PriceRangeSelection = [];

export const PRICE_RANGE_OPTIONS: PriceRangeOption[] = [
    {
        id: 'under-500',
        label: 'Menos de $500 MXN',
        range: { min: 0, max: 499 },
    },
    {
        id: '500-1000',
        label: '$500 - $1000 MXN',
        range: { min: 500, max: 1000 },
    },
    {
        id: '1000-plus',
        label: 'Más de $1000 MXN',
        range: { min: 1000, max: null },
    },
];

export function togglePriceRangeSelection(
    selection: PriceRangeSelection,
    optionId: string
): PriceRangeSelection {
    return selection.includes(optionId)
        ? selection.filter((id) => id !== optionId)
        : [...selection, optionId];
}

export function buildPriceNumericFilters(
    selection: PriceRangeSelection
): NumericFilters | undefined {
    const hasUnder500 = selection.includes('under-500');
    const has500To1000 = selection.includes('500-1000');
    const has1000Plus = selection.includes('1000-plus');

    if (
        selection.length === 0 ||
        (hasUnder500 && has500To1000 && has1000Plus)
    ) {
        return undefined;
    }

    if (hasUnder500 && has500To1000) {
        return ['minPrice<=1000'];
    }

    if (has500To1000 && has1000Plus) {
        return ['maxPrice>=500'];
    }

    if (hasUnder500 && has1000Plus) {
        return [['minPrice<=499', 'maxPrice>=1000']];
    }

    if (hasUnder500) {
        return ['minPrice<=499'];
    }

    if (has500To1000) {
        return ['maxPrice>=500', 'minPrice<=1000'];
    }

    if (has1000Plus) {
        return ['maxPrice>=1000'];
    }

    return undefined;
}
