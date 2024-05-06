import Service from '@ember/service';
import { createClient } from '@supabase/supabase-js';
import ENV from 'dsmi/config/environment';

export default class SupabaseService extends Service {
  supabaseClient = null;
  profilesCount = 0;

  get supabase() {
    if (!this.supabaseClient) {
      this.supabaseClient = createClient(ENV.SUPABASEURL, ENV.SUPABASETOKEN);
    }
    return this.supabaseClient;
  }

  set setCount(count) {
    this.profilesCount = count;
  }

  get count() {
    return this.profilesCount;
  }

  findAll(modelName) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.supabase.from(modelName).select();

      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  }

  findRecord(modelName, id) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.supabase
        .from(modelName)
        .select()
        .eq('id', id);

      if (!error) {
        resolve(data.pop());
      } else {
        reject(error);
      }
    });
  }

  query(modelName, query) {
    return new Promise(async (resolve, reject) => {
      let resp;

      if (query.query) {
        const [column, value] = Object.entries(query.query).pop();
        resp = this.supabase
          .from(modelName)
          .select('*', { count: 'exact' })
          .eq(column, value);
      } else if (query.range) {
        resp = this.supabase
          .from(modelName)
          .select('*', { count: 'exact' })
          .order('id', { ascending: true })
          .range(query.range[0], query.range[1]);
      }

      const { data, count, error } = await resp;

      if (!error) {
        this.profilesCount = count;
        resolve(data);
      } else {
        reject(error);
      }
    });
  }

  queryBy(modelName, options, filters) {
    return new Promise(async (resolve, reject) => {
      let query;

      if (filters.priceRange) {
        query = this.filterProfilesByPriceRange(
          filters.priceRange[0],
          filters.priceRange[1],
        );
      } else {
        this.supabase.from(modelName).select('*', { count: 'exact' });
      }

      if (filters.cities.length) {
        query.in('location', filters.cities);
      }

      if (filters.modalities.length) {
        query.contains('modalities', filters.modalities);
      }

      query.order('id', { ascending: true });

      if (options.range) {
        query.range(options.range[0], options.range[1]);
      }

      const { data, count, error } = await query;

      if (!error) {
        this.profilesCount = count;
        resolve(data);
      } else {
        reject(error);
      }
    });
  }

  filterProfilesByPriceRange(pricemin = 0, pricemax = 5000) {
    return this.supabase.rpc(
      'getprofilesfilteredbypricerange',
      {
        pricemin,
        pricemax,
      },
      {
        count: 'exact',
      },
    );
  }

  rpc(...args) {
    return new Promise(async (resolve, reject) => {
      let { data, error } = await this.supabase.rpc(...args);
      if (!error) {
        return resolve(data);
      } else {
        return reject(error);
      }
    });
  }
}
