import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service supabase;
  @service algolia;

  findAll(store, type) {
    return this.supabase.findAll(type.modelName);
  }

  findRecord(store, type, id, snapshot) {
    return this.supabase.findRecord(type.modelName, id);
  }

  query(store, type, query, recordArray, adapterOptions) {
    if (adapterOptions?.useAlgolia) {
      if (type.modelName !== 'mental-health-entities') {
        throw new Error('Algolia search not available for this model type');
      }

      return this.algolia.query(query);
    }

    if (adapterOptions?.random) {
      return this.supabase.getFeaturedProfiles();
    }

    if (adapterOptions?.filters) {
      return this.supabase.queryBy(
        type.modelName,
        query,
        adapterOptions.filters,
      );
    }

    return this.supabase.query(type.modelName, query);
  }
}
