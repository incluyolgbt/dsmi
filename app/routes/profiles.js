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
  };

  async getProfilesCount() {
    return await this.supabase.rpc('getProfilesCount');
  }

  async model(params) {
    let range = [];

    if (params.page) {
      range.push(10 * params.page - 10);
      range.push(range[0] + 9);
    } else {
      range = [0, 9];
    }

    const res = await RSVP.hash({
      profiles: this.store.query('mental-health-entities', {
        range,
      }),
      locations: this.store.findAll('locations'),
      profileCount: this.getProfilesCount()
    });

    if (!res.profiles.length) {
      this.router.transitionTo('not-found', 'not-found');
    }

    return { ...res };
  }
}
