import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service supabase;

  findAll(store, type) {
    return this.supabase.findAll(type.modelName);
  }

  findRecord(store, type, id, snapshot) {
    return this.supabase.findRecord(type.modelName, id);
  }

  query(store, type, query, recordArray, adapterOptions) {
    return this.supabase.query(type.modelName, query);
  }
}
