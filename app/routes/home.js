import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class HomeRoute extends Route {
  @service store;
  @service router;

  async model() {
    let range = [0, 3];

    const res = await RSVP.hash({
      profiles: this.store.query('mental-health-entities', {
        range,
      }),
      locations: this.store.findAll('locations'),
    });

    return { ...res };
  }
}
