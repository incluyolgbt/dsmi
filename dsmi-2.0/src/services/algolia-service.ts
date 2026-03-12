import { searchClient } from '@algolia/client-search';

const client = searchClient('VRJP9BQPHG', '5440a5d520b3094bfb7bba8ed9515df5');
const INDEX_NAME = 'dsmi-prod';

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