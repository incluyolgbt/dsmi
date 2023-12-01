import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class ProfileRoute extends Route {
  @service store;

  async model(params) {
    const profileId = params.mentalHealthEntity_id;

    const res = await RSVP.hash({
      profile: this.store.findRecord('mental-health-entities', profileId),
      modalities: this.store.query('modalities', {
        mentalHealthEntityId: profileId,
      }),
      focusAreas: this.store.query('focus-areas', {
        mentalHealthEntityId: profileId,
      }),
      socialMedia: this.store.query('social-media', {
        mentalHealthEntityId: profileId,
      }),
    });

    const location = await this.store.findRecord(
      'locations',
      res.profile.location,
    );

    return { ...res, location };
  }
}
