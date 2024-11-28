import Service from '@ember/service';
import { algoliasearch } from 'algoliasearch';
import ENV from 'dsmi/config/environment';

export default class SupabaseService extends Service {
  algoliaClient = null;
  profilesCount = 0;

  get algolia() {
    if (!this.algoliaClient) {
      this.algoliaClient = algoliasearch(ENV.ALGOLIAID, ENV.ALGOLIAKEY);
    }
    return this.algoliaClient;
  }

  query(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const facetFilters = [
          query?.filters?.cities?.map((item) => `location:${item}`),
          query?.filters?.modalities?.map((item) => `modalities:${item}`),
          query?.filters?.focusAreas?.map((item) => `focusAreas:${item}`),
        ].filter((item) => item?.length);

        const numericFilters = query?.filters?.priceRange?.length
          ? [
              `maxPrice>=${query.filters.priceRange[0]}`,
              `minPrice<=${query.filters.priceRange[1]}`,
            ]
          : [];

        const mappedQuery = {
          query: query?.filters?.searchTerm ?? '',
          page: query?.page ?? 0,
          facetFilters: facetFilters.length ? facetFilters : ['*'],
          numericFilters,
        };

        const response = await this.algolia.searchSingleIndex({
          indexName: ENV.ALGOLIAINDEX,
          searchParams: mappedQuery,
        });

        if (response?.hits) {
          this.profilesCount = response.nbHits;
          resolve(response.hits);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
