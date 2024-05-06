import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class ProfilesRoute extends Route {
  @service store;
  @service router;
  @service supabase;

  queryParams = {
    page: {
      refreshModel: true,
    },
    scroll: {
      refreshModel: true,
    },
    filter: {
      refreshModel: true,
    },
  };

  async getProfiles(range) {
    const filters = await this.store.peekRecord('filters', 'f01');

    if (filters) {
      return await this.store.query(
        'mental-health-entities',
        {
          range,
        },
        { filters: filters.serialize() },
      );
    }

    return await this.store.query('mental-health-entities', {
      range,
    });
  }

  async model(params) {
    let range = [];

    if (params.page) {
      range.push(10 * params.page - 10);
      range.push(range[0] + 9);
    } else {
      range = [0, 9];
    }

    const locations = await this.store.findAll('locations');
    const profiles = await this.getProfiles(range);
    const profileCount = this.supabase.profilesCount;

    return { locations, profiles, profileCount };
  }
}
