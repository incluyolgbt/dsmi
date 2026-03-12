import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './ActiveFilters.module.css';
import {
    PRICE_RANGE_OPTIONS,
    type PriceRangeSelection,
} from './priceRangeOptions';

const FACET_LABELS: Record<string, string> = {
    city: 'Ciudad',
    modalities: 'Modalidad',
    focusAreas: 'Enfoque Terapéutico',
    entityType: 'Tipo',
    state: 'Estado',
};

interface ActiveFiltersProps {
    selectedFacets: Record<string, string[]>;
    selectedPriceRanges: PriceRangeSelection;
    onRemoveFacet: (facetName: string, value: string) => void;
    onRemovePriceRange: (optionId: string) => void;
    children?: ReactNode;
}

export default function ActiveFilters({
    selectedFacets,
    selectedPriceRanges,
    onRemoveFacet,
    onRemovePriceRange,
    children,
}: ActiveFiltersProps) {
    const activeFacets = Object.entries(selectedFacets).flatMap(
        ([facetName, values]) => values.map((value) => ({ facetName, value }))
    );
    const activePriceRanges = PRICE_RANGE_OPTIONS.filter((option) =>
        selectedPriceRanges.includes(option.id)
    );

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftGradient, setShowLeftGradient] = useState(false);
    const [showRightGradient, setShowRightGradient] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const checkScroll = () => {
            const isAtStart = el.scrollLeft <= 10;
            const isAtEnd =
                el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
            setShowLeftGradient(!isAtStart);
            setShowRightGradient(!isAtEnd);
        };

        checkScroll();
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [activeFacets.length, activePriceRanges.length]);

    const scrollBy = (direction: 'left' | 'right') => {
        scrollRef.current?.scrollBy({
            left: direction === 'left' ? -120 : 120,
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.gradientOverlay} ${styles.gradientLeft} ${showLeftGradient ? '' : styles.gradientHidden}`}
            />
            <div
                ref={scrollRef}
                className={styles.container}
                role="region"
                aria-label="Filtros activos y controles de búsqueda"
                aria-live="polite"
            >
                {children}

                {activeFacets.map(({ facetName, value }) => (
                    <span
                        key={`${facetName}:${value}`}
                        className={styles.pill}
                        role="group"
                        aria-label={`Filtro activo: ${
                            FACET_LABELS[facetName]
                                ? `${FACET_LABELS[facetName]} ${value}`
                                : value
                        }`}
                    >
                        <span className={styles.label}>
                            {FACET_LABELS[facetName]
                                ? `${FACET_LABELS[facetName]}: `
                                : ''}
                            {value}
                        </span>
                        <button
                            className={styles.removeButton}
                            onClick={() => onRemoveFacet(facetName, value)}
                            aria-label={`Eliminar filtro ${
                                FACET_LABELS[facetName]
                                    ? `${FACET_LABELS[facetName]} ${value}`
                                    : value
                            }`}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </span>
                ))}

                {activePriceRanges.map((option) => (
                    <span
                        key={`price:${option.id}`}
                        className={styles.pill}
                        role="group"
                        aria-label={`Filtro activo: precio ${option.label}`}
                    >
                        <span className={styles.label}>
                            Precio: {option.label}
                        </span>
                        <button
                            className={styles.removeButton}
                            onClick={() => onRemovePriceRange(option.id)}
                            aria-label={`Eliminar filtro de precio ${option.label}`}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </span>
                ))}
            </div>
            <div
                className={`${styles.gradientOverlay} ${styles.gradientRight} ${showRightGradient ? '' : styles.gradientHidden}`}
            />
            <button
                className={`${styles.scrollArrow} ${styles.scrollArrowLeft} ${showLeftGradient ? '' : styles.scrollArrowHidden}`}
                onClick={() => scrollBy('left')}
                aria-label="Desplazar a la izquierda"
                aria-hidden={!showLeftGradient}
                tabIndex={showLeftGradient ? 0 : -1}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button
                className={`${styles.scrollArrow} ${styles.scrollArrowRight} ${showRightGradient ? '' : styles.scrollArrowHidden}`}
                onClick={() => scrollBy('right')}
                aria-label="Desplazar a la derecha"
                aria-hidden={!showRightGradient}
                tabIndex={showRightGradient ? 0 : -1}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>
        </div>
    );
}
