import { searchClient } from '@algolia/client-search';

const client = searchClient(
    import.meta.env.PUBLIC_ALGOLIA_APP_ID,
    import.meta.env.PUBLIC_ALGOLIA_API_KEY
);
const INDEX_NAME = import.meta.env.ALGOLIA_INDEX;

export const getProfiles = async ({
    query = '',
    facets = [],
    numericFilters = [],
    facetFilters = [],
    hitsPerPage = 8,
    page = 0,
}: {
    query?: string;
    facets?: string[];
    numericFilters?: string[];
    facetFilters?: string[];
    hitsPerPage?: number;
    page?: number;
}) => {
    const { results } = await client.search({
        requests: [
            {
                indexName: INDEX_NAME,
                query,
                facets,
                numericFilters,
                facetFilters,
                hitsPerPage,
                page,
            },
        ],
    });

    const firstResult = results[0];
    return 'hits' in firstResult ? firstResult : null;
};