import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ProfilesRoute extends Route {
  @service store;
  @service router;
  @service algolia;

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

  async getProfiles(page) {
    const filters = await this.store.peekRecord('filters', 'f01');

    if (filters) {
      return await this.store.query(
        'mental-health-entities',
        {
          filters: filters.serialize(),
          page,
        },
        { useAlgolia: true },
      );
    }

    return await this.store.query(
      'mental-health-entities',
      {
        page,
      },
      { useAlgolia: true },
    );
  }

  async model(params) {
    const locations = await this.store.findAll('locations');
    const focusAreas = await this.store.findAll('focus-areas-options');
    const profiles = await this.getProfiles(params.page - 1);
    const profileCount = this.algolia.profilesCount;

    return { locations, focusAreas, profiles, profileCount };
  }
}
