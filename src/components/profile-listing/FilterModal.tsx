// FilterModal.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './FilterModal.module.css';
import {
    PRICE_RANGE_OPTIONS,
    type PriceRangeSelection,
} from './priceRangeOptions';

interface FacetValues {
    [value: string]: number;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
    facets: Record<string, FacetValues>;
    selectedFacets: Record<string, string[]>;
    onToggleFacet: (facetName: string, value: string) => void;
    selectedPriceRanges: PriceRangeSelection;
    onTogglePriceRange: (optionId: string) => void;
    onApply: () => void;
    onClearAll: () => void;
    autoFocusSearch?: boolean;
}

const FACET_LABELS: Record<string, string> = {
    city: 'Ciudades',
    modalities: 'Modalidades',
    focusAreas: 'Enfoque Terapéutico',
};

const getFacetLabel = (facetName: string) =>
    FACET_LABELS[facetName] ?? facetName;

export default function FilterModal({
    isOpen,
    onClose,
    query,
    onQueryChange,
    onSearch,
    facets,
    selectedFacets,
    onToggleFacet,
    selectedPriceRanges,
    onTogglePriceRange,
    onApply,
    onClearAll,
    autoFocusSearch = false,
}: FilterModalProps) {
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({});
    const [isClosing, setIsClosing] = useState(false);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const bodyRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen || !autoFocusSearch) return;

        setExpandedSections((prev) => ({ ...prev, keyword: true }));

        const focusTimer = window.setTimeout(() => {
            searchInputRef.current?.focus({ preventScroll: true });
        }, 100);

        return () => window.clearTimeout(focusTimer);
    }, [autoFocusSearch, isOpen]);

    const handleBodyFocus = useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            const body = bodyRef.current;
            if (!body) return;

            // The focused element may be invisible (e.g. visually-hidden checkbox),
            // so walk up the DOM to find the nearest ancestor with real dimensions.
            let target: HTMLElement = e.target as HTMLElement;
            while (target && target !== body) {
                const rect = target.getBoundingClientRect();
                if (rect.height > 0 && rect.width > 0) break;
                target = target.parentElement as HTMLElement;
            }
            if (!target || target === body) return;

            requestAnimationFrame(() => {
                const bodyRect = body.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();

                const overflowTop = bodyRect.top - targetRect.top;
                const overflowBottom = targetRect.bottom - bodyRect.bottom;

                if (overflowTop > 0) {
                    body.scrollBy({
                        top: -overflowTop - 8,
                        behavior: 'instant',
                    });
                } else if (overflowBottom > 0) {
                    body.scrollBy({
                        top: overflowBottom + 8,
                        behavior: 'instant',
                    });
                }
            });
        },
        []
    );

    const toggleSection = (key: string) => {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const triggerClose = useCallback(
        (afterClose?: () => void) => {
            if (closeTimerRef.current) return;
            setIsClosing(true);
            closeTimerRef.current = setTimeout(() => {
                closeTimerRef.current = null;
                setIsClosing(false);
                if (afterClose) afterClose();
                onClose();
            }, 250);
        },
        [onClose]
    );

    if (!isOpen && !isClosing) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) triggerClose();
    };

    const handleKeywordSearch = (e: React.FormEvent) => {
        e.preventDefault();
        triggerClose(onSearch);
    };

    return (
        <div
            id="filter-modal"
            className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
        >
            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`}
                role="document"
            >
                <div className={styles.header}>
                    <h2 className={styles.title} id="filter-modal-title">
                        Filtrar y buscar perfiles
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={() => triggerClose()}
                        aria-label="Cerrar filtros"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <div
                    className={styles.body}
                    ref={bodyRef}
                    onFocus={handleBodyFocus}
                >
                    {/* Keyword search section */}
                    <div
                        className={styles.section}
                        role="region"
                        aria-labelledby="filter-keyword-toggle"
                    >
                        <button
                            id="filter-keyword-toggle"
                            className={`${styles.sectionToggle} ${
                                expandedSections['keyword']
                                    ? styles.expanded
                                    : ''
                            }`}
                            onClick={() => toggleSection('keyword')}
                            aria-expanded={!!expandedSections['keyword']}
                            aria-controls="accordion-keyword"
                            aria-label={`${
                                expandedSections['keyword']
                                    ? 'Ocultar'
                                    : 'Mostrar'
                            } búsqueda por palabras clave`}
                        >
                            <span>Búsqueda por palabras clave</span>
                            <svg
                                className={styles.chevron}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <div
                            id="accordion-keyword"
                            className={`${styles.accordionBody} ${
                                expandedSections['keyword']
                                    ? styles.accordionOpen
                                    : ''
                            }`}
                            aria-hidden={!expandedSections['keyword']}
                            role="group"
                            aria-labelledby="filter-keyword-toggle"
                        >
                            <form
                                className={styles.searchForm}
                                onSubmit={handleKeywordSearch}
                                role="search"
                                aria-label="Buscar perfiles por palabras clave"
                            >
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    className={styles.searchInput}
                                    placeholder="Nombre, apellidos..."
                                    aria-label="Buscar por nombre, apellidos o palabras clave"
                                    value={query}
                                    onChange={(e) =>
                                        onQueryChange(e.target.value)
                                    }
                                    tabIndex={
                                        expandedSections['keyword'] ? 0 : -1
                                    }
                                />
                                <button
                                    type="submit"
                                    className={styles.searchButton}
                                    tabIndex={
                                        expandedSections['keyword'] ? 0 : -1
                                    }
                                >
                                    Buscar
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Facet sections */}
                    {Object.entries(facets).map(([facetName, values]) => (
                        <div
                            className={styles.section}
                            key={facetName}
                            role="region"
                            aria-labelledby={`filter-${facetName}-toggle`}
                        >
                            <button
                                id={`filter-${facetName}-toggle`}
                                className={`${styles.sectionToggle} ${
                                    expandedSections[facetName]
                                        ? styles.expanded
                                        : ''
                                }`}
                                onClick={() => toggleSection(facetName)}
                                aria-expanded={!!expandedSections[facetName]}
                                aria-controls={`accordion-${facetName}`}
                                aria-label={`${
                                    expandedSections[facetName]
                                        ? 'Ocultar'
                                        : 'Mostrar'
                                } filtro de ${getFacetLabel(facetName)}`}
                            >
                                <span>
                                    {getFacetLabel(facetName)}
                                    {(selectedFacets[facetName]?.length ?? 0) >
                                        0 && (
                                        <span className={styles.badge}>
                                            {selectedFacets[facetName].length}
                                        </span>
                                    )}
                                </span>
                                <svg
                                    className={styles.chevron}
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                            <div
                                id={`accordion-${facetName}`}
                                className={`${styles.accordionBody} ${
                                    expandedSections[facetName]
                                        ? styles.accordionOpen
                                        : ''
                                }`}
                                aria-hidden={!expandedSections[facetName]}
                                role="group"
                                aria-labelledby={`filter-${facetName}-toggle`}
                            >
                                <ul
                                    className={styles.facetList}
                                    role="list"
                                    aria-label={`Opciones de ${getFacetLabel(
                                        facetName
                                    )}`}
                                >
                                    {Object.entries(values).map(
                                        ([value, count]) => {
                                            const isSelected =
                                                selectedFacets[
                                                    facetName
                                                ]?.includes(value) ?? false;
                                            return (
                                                <li key={value}>
                                                    <label
                                                        className={
                                                            styles.facetLabel
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className={
                                                                styles.facetCheckbox
                                                            }
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                onToggleFacet(
                                                                    facetName,
                                                                    value
                                                                )
                                                            }
                                                            aria-label={`Filtrar por ${getFacetLabel(
                                                                facetName
                                                            )}: ${value}, ${count} ${
                                                                count === 1
                                                                    ? 'perfil'
                                                                    : 'perfiles'
                                                            }`}
                                                            tabIndex={
                                                                expandedSections[
                                                                    facetName
                                                                ]
                                                                    ? 0
                                                                    : -1
                                                            }
                                                        />
                                                        <span
                                                            className={`${styles.checkmark} ${
                                                                isSelected
                                                                    ? styles.checked
                                                                    : ''
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                        <span
                                                            className={
                                                                styles.facetValue
                                                            }
                                                        >
                                                            {value}
                                                        </span>
                                                        <span
                                                            className={
                                                                styles.facetCount
                                                            }
                                                        >
                                                            {count}
                                                        </span>
                                                    </label>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}

                    {/* Price range section */}
                    <div
                        className={styles.section}
                        role="region"
                        aria-labelledby="filter-price-range-toggle"
                    >
                        <button
                            id="filter-price-range-toggle"
                            className={`${styles.sectionToggle} ${
                                expandedSections['priceRange']
                                    ? styles.expanded
                                    : ''
                            }`}
                            onClick={() => toggleSection('priceRange')}
                            aria-expanded={!!expandedSections['priceRange']}
                            aria-controls="accordion-priceRange"
                            aria-label={`${
                                expandedSections['priceRange']
                                    ? 'Ocultar'
                                    : 'Mostrar'
                            } filtro de rango de precios`}
                        >
                            <span>
                                Rango de precios
                                {selectedPriceRanges.length > 0 && (
                                    <span className={styles.badge}>
                                        {selectedPriceRanges.length}
                                    </span>
                                )}
                            </span>
                            <svg
                                className={styles.chevron}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <div
                            id="accordion-priceRange"
                            className={`${styles.accordionBody} ${
                                expandedSections['priceRange']
                                    ? styles.accordionOpen
                                    : ''
                            }`}
                            aria-hidden={!expandedSections['priceRange']}
                            role="group"
                            aria-labelledby="filter-price-range-toggle"
                        >
                            <div
                                className={styles.priceRangeContainer}
                                role="list"
                                aria-label="Opciones de rango de precios"
                            >
                                {PRICE_RANGE_OPTIONS.map((option) => {
                                    const isSelected =
                                        selectedPriceRanges.includes(option.id);

                                    return (
                                        <label
                                            key={option.id}
                                            className={styles.facetLabel}
                                        >
                                            <input
                                                type="checkbox"
                                                className={styles.facetCheckbox}
                                                checked={isSelected}
                                                onChange={() =>
                                                    onTogglePriceRange(
                                                        option.id
                                                    )
                                                }
                                                aria-label={`Filtrar por rango de precios: ${option.label}`}
                                                tabIndex={
                                                    expandedSections[
                                                        'priceRange'
                                                    ]
                                                        ? 0
                                                        : -1
                                                }
                                            />
                                            <span
                                                className={`${styles.checkmark} ${
                                                    isSelected
                                                        ? styles.checked
                                                        : ''
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <span className={styles.facetValue}>
                                                {option.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.primaryButton}
                        onClick={() => triggerClose(onApply)}
                        aria-label="Aplicar filtros seleccionados"
                    >
                        Aplicar filtros
                    </button>
                    <button
                        className={styles.secondaryButton}
                        onClick={() => triggerClose(onClearAll)}
                        aria-label="Limpiar todos los filtros seleccionados"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
