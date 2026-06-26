import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { searchClient } from '@algolia/client-search';
import NameCard, { NameCardSkeleton } from './NameCard';
import Pagination from './Pagination';
import FilterModal from './FilterModal';
import ActiveFilters from './ActiveFilters';
import styles from './ProfilesGrid.module.css';
import {
    buildPriceNumericFilters,
    DEFAULT_PRICE_RANGE_SELECTION,
    PRICE_RANGE_OPTIONS,
    togglePriceRangeSelection,
} from './priceRangeOptions';
import { updateProfilesStructuredData } from './profilesStructuredData';
import { createUmamiEvent, sendUmamiEvent } from '../../utils/analytics';

const client = searchClient(
    import.meta.env.PUBLIC_ALGOLIA_APP_ID,
    import.meta.env.PUBLIC_ALGOLIA_API_KEY
);

const INDEX_NAME = import.meta.env.PUBLIC_ALGOLIA_INDEX;
const FACET_PARAM_PREFIX = 'f_';
const PRICE_RANGE_PARAM = `${FACET_PARAM_PREFIX}price`;
const QUERY_PARAM = 'q';
const SEARCH_DRAWER_PARAM = 'search';
const SEARCH_DRAWER_VALUE = 'new';
const HITS_PER_PAGE = 8;
type PlpEventName = 'plp_filters_applied' | 'plp_search_performed';

function isShareableSearchParam(paramName: string) {
    return (
        paramName === QUERY_PARAM ||
        paramName === 'page' ||
        paramName.startsWith(FACET_PARAM_PREFIX)
    );
}

function syncCanonicalUrlForSharing() {
    if (typeof window === 'undefined') return;

    const canonicalLink = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
    );
    const canonicalUrl = new URL(
        canonicalLink?.href || window.location.href,
        window.location.href
    );
    const currentParams = new URLSearchParams(window.location.search);
    const shareParams = new URLSearchParams();

    currentParams.forEach((value, key) => {
        if (isShareableSearchParam(key)) {
            shareParams.append(key, value);
        }
    });

    canonicalUrl.search = shareParams.toString();

    if (canonicalLink) {
        canonicalLink.href = canonicalUrl.toString();
    }
}

interface ProfileHit {
    objectID: string;
    firstName: string;
    lastName: string;
    entityType: string;
    profilePicture: string;
    city: string;
    state: string;
    modalities: string[];
    slug: string;
}

interface FacetValues {
    [value: string]: number;
}

function getPageFromUrl(): number {
    if (typeof window === 'undefined') return 1;
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') ?? '1', 10);
    return Number.isNaN(page) || page < 1 ? 1 : page;
}

function getEmptyFacetSelection(facetNames: string[]) {
    return facetNames.reduce<Record<string, string[]>>((acc, facetName) => {
        acc[facetName] = [];
        return acc;
    }, {});
}

function normalizeFacetValue(
    value: string,
    facetValues: FacetValues | undefined
) {
    const knownValue = Object.keys(facetValues ?? {}).find(
        (facetValue) => facetValue.toLowerCase() === value.toLowerCase()
    );

    return knownValue ?? value;
}

function getFacetsFromUrl(facets: Record<string, FacetValues>) {
    const facetNames = Object.keys(facets);
    const selectedFacets = getEmptyFacetSelection(facetNames);

    if (typeof window === 'undefined') return selectedFacets;

    const params = new URLSearchParams(window.location.search);
    facetNames.forEach((facetName) => {
        const values = params
            .getAll(`${FACET_PARAM_PREFIX}${facetName}`)
            .flatMap((value) => value.split(','))
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => normalizeFacetValue(value, facets[facetName]));

        selectedFacets[facetName] = Array.from(new Set(values));
    });

    return selectedFacets;
}

function getQueryFromUrl() {
    if (typeof window === 'undefined') return '';

    return new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? '';
}

function shouldOpenSearchDrawerFromUrl() {
    if (typeof window === 'undefined') return false;

    return (
        new URLSearchParams(window.location.search).get(SEARCH_DRAWER_PARAM) ===
        SEARCH_DRAWER_VALUE
    );
}

function removeSearchDrawerParamFromUrl() {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.delete(SEARCH_DRAWER_PARAM);
    window.history.replaceState({}, '', url.toString());
    syncCanonicalUrlForSharing();
}

function getPriceRangesFromUrl() {
    if (typeof window === 'undefined') return DEFAULT_PRICE_RANGE_SELECTION;

    const validOptionIds = new Set(PRICE_RANGE_OPTIONS.map(({ id }) => id));
    const params = new URLSearchParams(window.location.search);
    const priceRanges = params
        .getAll(PRICE_RANGE_PARAM)
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .filter((value) => validOptionIds.has(value));

    return Array.from(new Set(priceRanges));
}

function setSearchStateInUrl({
    page,
    query,
    selectedFacets,
    selectedPriceRanges,
    facetNames,
}: {
    page: number;
    query: string;
    selectedFacets: Record<string, string[]>;
    selectedPriceRanges: string[];
    facetNames: string[];
}) {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
        url.searchParams.set(QUERY_PARAM, trimmedQuery);
    } else {
        url.searchParams.delete(QUERY_PARAM);
    }

    if (page <= 1) {
        url.searchParams.delete('page');
    } else {
        url.searchParams.set('page', String(page));
    }

    facetNames.forEach((facetName) => {
        url.searchParams.delete(`${FACET_PARAM_PREFIX}${facetName}`);
        (selectedFacets[facetName] ?? []).forEach((value) => {
            url.searchParams.append(`${FACET_PARAM_PREFIX}${facetName}`, value);
        });
    });

    url.searchParams.delete(PRICE_RANGE_PARAM);
    selectedPriceRanges.forEach((value) => {
        url.searchParams.append(PRICE_RANGE_PARAM, value);
    });

    window.history.pushState({}, '', url.toString());
    syncCanonicalUrlForSharing();
}

function getSelectedFacetSummary(selectedFacets: Record<string, string[]>) {
    return Object.fromEntries(
        Object.entries(selectedFacets)
            .filter(([, values]) => values.length > 0)
            .sort(([a], [b]) => a.localeCompare(b))
    );
}

function createPlpEventData({
    query,
    selectedFacets,
    selectedPriceRanges,
    nbHits,
}: {
    query: string;
    selectedFacets: Record<string, string[]>;
    selectedPriceRanges: string[];
    nbHits: number;
}) {
    const trimmedQuery = query.trim();

    return {
        query: trimmedQuery,
        has_query: trimmedQuery.length > 0,
        nbHits,
        facets: getSelectedFacetSummary(selectedFacets),
        price_range_count: selectedPriceRanges.length,
        price_ranges: selectedPriceRanges,
    };
}

export default function ProfilesGrid({
    initialHits,
    initialPage,
    initialTotalPages,
    initialFacets,
}: {
    initialHits: ProfileHit[];
    initialPage: number;
    initialTotalPages: number;
    initialFacets: Record<string, FacetValues>;
}) {
    const facetNames = useMemo(
        () => Object.keys(initialFacets),
        [initialFacets]
    );
    const initialFacetSelection = useMemo(
        () => getFacetsFromUrl(initialFacets),
        [initialFacets]
    );
    const initialQuery = useMemo(() => getQueryFromUrl(), []);
    const initialPriceRangeSelection = useMemo(
        () => getPriceRangesFromUrl(),
        []
    );
    const [query, setQuery] = useState(initialQuery);
    const [hits, setHits] = useState<ProfileHit[]>(initialHits);
    const [facets, setFacets] =
        useState<Record<string, FacetValues>>(initialFacets);
    const [selectedFacets, setSelectedFacets] = useState<
        Record<string, string[]>
    >(initialFacetSelection);
    const [pendingFacets, setPendingFacets] = useState<
        Record<string, string[]>
    >(initialFacetSelection);
    const [page, setPage] = useState(Math.max(initialPage, 1) - 1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [isLoading, setIsLoading] = useState(initialHits.length === 0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [shouldAutoFocusSearch, setShouldAutoFocusSearch] = useState(false);
    const [pendingQuery, setPendingQuery] = useState(initialQuery);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState(
        initialPriceRangeSelection
    );
    const [pendingPriceRanges, setPendingPriceRanges] = useState(
        initialPriceRangeSelection
    );
    const [searchRevision, setSearchRevision] = useState(0);
    const searchRequestId = useRef(0);
    const pendingAnalyticsEventName = useRef<PlpEventName | null>(null);

    // Sync page from URL on mount and when user navigates with back/forward buttons
    useEffect(() => {
        setPage(getPageFromUrl() - 1);
        const handlePopState = () => {
            const nextFacets = getFacetsFromUrl(initialFacets);
            const nextQuery = getQueryFromUrl();
            const nextPriceRanges = getPriceRangesFromUrl();
            setPage(getPageFromUrl() - 1);
            setQuery(nextQuery);
            setPendingQuery(nextQuery);
            setSelectedFacets(nextFacets);
            setPendingFacets(nextFacets);
            setSelectedPriceRanges(nextPriceRanges);
            setPendingPriceRanges(nextPriceRanges);
            const shouldOpenSearchDrawer = shouldOpenSearchDrawerFromUrl();
            setIsFilterOpen(shouldOpenSearchDrawer);
            setShouldAutoFocusSearch(shouldOpenSearchDrawer);
            if (shouldOpenSearchDrawer) removeSearchDrawerParamFromUrl();
            else syncCanonicalUrlForSharing();
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialFacets]);

    useEffect(() => {
        syncCanonicalUrlForSharing();
    }, []);

    const handlePageChange = useCallback(
        (oneBasedPage: number) => {
            const zeroBasedPage = oneBasedPage - 1;
            setPage(zeroBasedPage);
            setSearchStateInUrl({
                page: oneBasedPage,
                query,
                selectedFacets,
                selectedPriceRanges,
                facetNames,
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [facetNames, query, selectedFacets, selectedPriceRanges]
    );

    const toggleBackContentScrollability = useCallback(
        (isScrollable: boolean) => {
            const mainContent = document.body;
            if (mainContent)
                mainContent.style.overflowY = isScrollable ? 'auto' : 'hidden';
        },
        []
    );

    useEffect(() => {
        if (!isFilterOpen) return;

        toggleBackContentScrollability(false);

        return () => toggleBackContentScrollability(true);
    }, [isFilterOpen, toggleBackContentScrollability]);

    useEffect(() => {
        if (!shouldOpenSearchDrawerFromUrl()) return;

        setIsFilterOpen(true);
        setShouldAutoFocusSearch(true);
        removeSearchDrawerParamFromUrl();
    }, []);

    const search = useCallback(async () => {
        const requestId = searchRequestId.current + 1;
        searchRequestId.current = requestId;
        const analyticsEventName = pendingAnalyticsEventName.current;
        pendingAnalyticsEventName.current = null;
        setIsLoading(true);
        try {
            const facetFilters = Object.entries(selectedFacets)
                .filter(([, values]) => values.length > 0)
                .map(([key, values]) => values.map((v) => `${key}:${v}`));
            const numericFilters =
                buildPriceNumericFilters(selectedPriceRanges);

            const { results } = await client.search({
                requests: [
                    {
                        indexName: INDEX_NAME,
                        query,
                        facets: [
                            'entityType',
                            'city',
                            'modalities',
                            'focusAreas',
                        ],
                        numericFilters,
                        facetFilters,
                        hitsPerPage: HITS_PER_PAGE,
                        page,
                    },
                ],
            });

            const result = results[0];
            if (requestId !== searchRequestId.current) return;

            if ('hits' in result) {
                const nextHits = result.hits as ProfileHit[];
                const nbHits = result.nbHits ?? nextHits.length;
                setHits(nextHits);
                setTotalPages(result.nbPages ?? 0);
                updateProfilesStructuredData({
                    profiles: nextHits,
                    page: page + 1,
                    hitsPerPage: HITS_PER_PAGE,
                    url: window.location.href,
                });
                if (analyticsEventName) {
                    sendUmamiEvent(
                        createUmamiEvent(
                            analyticsEventName,
                            createPlpEventData({
                                query,
                                selectedFacets,
                                selectedPriceRanges,
                                nbHits,
                            })
                        )
                    );
                }
                // if (result.facets)
                //     setFacets(result.facets as Record<string, FacetValues>);
            }
        } catch (error) {
            if (requestId !== searchRequestId.current) return;
            // TODO: Add proper error handling and logging
            console.error('Error al buscar perfiles', error);
        } finally {
            if (requestId !== searchRequestId.current) return;
            setIsLoading(false);
        }
    }, [query, selectedFacets, page, selectedPriceRanges]);

    useEffect(() => {
        search();
    }, [search, searchRevision]);

    const toggleFacet = (facetName: string, value: string) => {
        setPendingFacets((prev) => {
            const current = prev[facetName] ?? [];
            const next = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [facetName]: next };
        });
    };

    const onTogglePriceRange = (optionId: string) => {
        setPendingPriceRanges((prev) =>
            togglePriceRangeSelection(prev, optionId)
        );
    };

    const removeActiveFacet = useCallback(
        (facetName: string, value: string) => {
            const nextFacets = {
                ...selectedFacets,
                [facetName]: (selectedFacets[facetName] ?? []).filter(
                    (v) => v !== value
                ),
            };
            setSelectedFacets(nextFacets);
            setPage(0);
            setSearchStateInUrl({
                page: 1,
                query,
                selectedFacets: nextFacets,
                selectedPriceRanges,
                facetNames,
            });
        },
        [facetNames, query, selectedFacets, selectedPriceRanges]
    );

    const applyFilters = useCallback(
        (eventName: PlpEventName) => {
            pendingAnalyticsEventName.current = eventName;
            setQuery(pendingQuery);
            setSelectedFacets(pendingFacets);
            setSelectedPriceRanges(pendingPriceRanges);
            setPage(0);
            setSearchRevision((revision) => revision + 1);
            setSearchStateInUrl({
                page: 1,
                query: pendingQuery,
                selectedFacets: pendingFacets,
                selectedPriceRanges: pendingPriceRanges,
                facetNames,
            });
        },
        [facetNames, pendingFacets, pendingPriceRanges, pendingQuery]
    );

    const clearAllFilters = useCallback(() => {
        const emptyFacets = getEmptyFacetSelection(facetNames);

        setPendingQuery('');
        setPendingFacets(emptyFacets);
        setPendingPriceRanges(DEFAULT_PRICE_RANGE_SELECTION);
        setQuery('');
        setSelectedFacets(emptyFacets);
        setSelectedPriceRanges(DEFAULT_PRICE_RANGE_SELECTION);
        setPage(0);
        setSearchStateInUrl({
            page: 1,
            query: '',
            selectedFacets: emptyFacets,
            selectedPriceRanges: DEFAULT_PRICE_RANGE_SELECTION,
            facetNames,
        });
    }, [facetNames]);

    const removeActivePriceRange = useCallback(
        (optionId: string) => {
            const nextPriceRanges = selectedPriceRanges.filter(
                (selectedId) => selectedId !== optionId
            );
            setSelectedPriceRanges(nextPriceRanges);
            setPage(0);
            setSearchStateInUrl({
                page: 1,
                query,
                selectedFacets,
                selectedPriceRanges: nextPriceRanges,
                facetNames,
            });
        },
        [facetNames, query, selectedFacets, selectedPriceRanges]
    );

    return (
        <div className="profile-search">
            <div className={styles['page-content']}>
                <div className={styles['filter-bar']}>
                    <ActiveFilters
                        selectedFacets={selectedFacets}
                        selectedPriceRanges={selectedPriceRanges}
                        onRemoveFacet={removeActiveFacet}
                        onRemovePriceRange={removeActivePriceRange}
                    >
                        <button
                            className={styles['filter-button']}
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={isFilterOpen}
                            aria-controls="filter-modal"
                            aria-label="Abrir filtros y búsqueda de perfiles"
                            onClick={() => {
                                setPendingFacets(selectedFacets);
                                setPendingQuery(query);
                                setPendingPriceRanges(selectedPriceRanges);
                                setShouldAutoFocusSearch(false);
                                setIsFilterOpen(true);
                                toggleBackContentScrollability(false);
                            }}
                        >
                            <svg
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
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Filtrar y buscar perfiles
                        </button>
                    </ActiveFilters>
                </div>

                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => {
                        setIsFilterOpen(false);
                        setShouldAutoFocusSearch(false);
                        toggleBackContentScrollability(true);
                    }}
                    query={pendingQuery}
                    onQueryChange={setPendingQuery}
                    onSearch={() => {
                        applyFilters('plp_search_performed');
                    }}
                    facets={facets}
                    selectedFacets={pendingFacets}
                    onToggleFacet={toggleFacet}
                    selectedPriceRanges={pendingPriceRanges}
                    onTogglePriceRange={onTogglePriceRange}
                    onApply={() => {
                        applyFilters('plp_filters_applied');
                    }}
                    onClearAll={() => {
                        clearAllFilters();
                    }}
                    autoFocusSearch={shouldAutoFocusSearch}
                />

                <div className="search-layout">
                    {/* <aside className="facet-sidebar">
                        {Object.entries(facets).map(([facetName, values]) => (
                            <div key={facetName} className="facet-group">
                                <h3>{facetName}</h3>
                                <ul>
                                    {Object.entries(values).map(
                                        ([value, count]) => (
                                            <li key={value}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedFacets[
                                                                facetName
                                                            ]?.includes(value) ??
                                                            false
                                                        }
                                                        onChange={() =>
                                                            toggleFacet(
                                                                facetName,
                                                                value
                                                            )
                                                        }
                                                    />
                                                    {value} ({count})
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </aside> */}

                    <div
                        className={styles['profiles-container']}
                        data-pagefind-ignore
                    >
                        {isLoading
                            ? Array.from({ length: 8 }, (_, i) => (
                                  <NameCardSkeleton key={i} />
                              ))
                            : hits.map((hit) => (
                                  <NameCard
                                      key={hit.objectID}
                                      name={
                                          hit.lastName
                                              ? `${hit.firstName} ${hit.lastName}`
                                              : hit.firstName
                                      }
                                      title={hit.entityType}
                                      image={hit.profilePicture}
                                      city={hit.city}
                                      modalities={hit.modalities}
                                      profileUrl={`/perfil/${hit.slug}/`}
                                      prefetch={false}
                                  />
                              ))}
                        {!isLoading && hits.length === 0 && (
                            <p className="no-results">
                                No se encontraron perfiles.
                            </p>
                        )}
                    </div>
                </div>

                <Pagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
