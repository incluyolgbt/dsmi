import Service from '@ember/service';
import { createClient } from '@supabase/supabase-js';
import ENV from 'dsmi/config/environment';

export default class SupabaseService extends Service {
  supabaseClient = null;

  get supabase() {
    if (!this.supabaseClient) {
      this.supabaseClient = createClient(ENV.SUPABASEURL, ENV.SUPABASETOKEN);
    }
    return this.supabaseClient;
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

  query(modelName, query, options) {
    return new Promise(async (resolve, reject) => {
      let resp;

      if (query.query) {
        const [column, value] = Object.entries(query.query).pop();
        resp = await this.supabase.from(modelName).select().eq(column, value);
      } else if (query.range) {
        resp = await this.supabase
          .from(modelName)
          .select()
          .order('id', { ascending: true })
          .range(query.range[0], query.range[1]);
      }

      const { data, error } = resp;

      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  }
}
