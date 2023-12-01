import Service from '@ember/service';
import { createClient } from '@supabase/supabase-js';
import ENV from 'dsmi/config/environment';

export default class SupabaseService extends Service {
  get supabase() {
    return createClient(ENV.SUPABASEURL, ENV.SUPABASETOKEN);
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
      const [column, value] = Object.entries(query).pop();

      const { data, error } = await this.supabase
        .from(modelName)
        .select()
        .eq(column, value);

      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  }
}
